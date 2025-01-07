
import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import {RedisStore} from "connect-redis";
import session from "express-session";
import {createClient} from "redis";
import { fileURLToPath } from "url";

const __dirname=dirname(fileURLToPath(import.meta.url));

// Initialize client.

let redisClient = createClient({
  socket: {
    host: 'host.docker.internal', // Change this if Redis is on a different host
    port: 2800,        // Replace with the correct port if Redis is on a different port
    timeout:10000,
  },});
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  //prefix: "myapp:",
});

// Initialize session storage.


const app=express();
const port=4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    store:redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.SESSION_SECRET || "Bread and Butter",
    cookie:{
      maxAge:3600000,
    }
  }),
)
app.set('view engine', 'ejs');
//app.set('views', dirname.join(__dirname, 'views'));

var posts=[["The Long Night Moon",["space","astronomy"],"On the night of December 15, the Full Moon was bright. Known to some as the Cold Moon or the Long Night Moon, it was the closest Full Moon to the northern winter solstice and the last Full Moon of 2024. This Full Moon was also at a major lunar standstill. A major lunar standstill is an extreme in the monthly north-south range of moonrise and moonset caused by the precession of the Moon's orbit over an 18.6 year cycle. As a result, the full lunar phase was near the Moon's northernmost moonrise (and moonset) along the horizon. December's Full Moon is rising in this stacked image, a composite of exposures recording the range of brightness visible to the eye on the northern winter night. Along with a colorful lunar corona and aircraft contrail this Long Night Moon shines in a cold sky above the rugged, snowy peaks of the Italian Dolomites."],["Heading2",[],"Hii"]];

app.listen(process.env.PORT || port, () => {
    console.log(`Listening on port ${port}`);
  });

app.get("/",(req,res)=>{
    res.render("index.ejs",{data:posts});
});

app.get("/write",(req,res)=>{
    res.render("write.ejs");
});

app.post("/write",(req,res)=>{
  console.log(req.body);
  const {title,tags,content}=req.body;
  var newTags=tags.replace(/\s/g,"");
  console.log(newTags);
  newTags=tags.replace("#","");
  console.log(newTags);
  newTags=newTags.split("#");
  posts.push([title,newTags,content]);
  res.redirect("/");
  
});

app.post("/update",(req,res)=>{
    const {index}=req.body;
    console.log("The index received is",index);
    if(index!=undefined){
      req.session.data={index:index,title:posts[index][0],tags:posts[index][1],content:posts[index][2]};
      console.log(req.session.data.title);
      res.sendStatus(201);
    
    req.session.save(err => {
      if (err) console.error(err);
    
     // res.redirect("/update");

  });}
});

app.get("/update",(req,res)=>{
  //res.render('update.ejs');
  console.log("Here's the index:",req.session.data.index);
  const id=req.session.data.index;
  if (id !== undefined) {
    // Render the update page and pass the session index if it's available
    res.render("update.ejs",{data:req.session.data});
  } else {
    console.log("Session index not found. Please try again.");
  }

  req.session.destroy();
});

app.post("/modify",(req,res)=>{
  const {title,tags,content,index}=req.body;
  console.log(req);
  var newTags=tags.replace(/\s/g,"");
  console.log(newTags);
  newTags=tags.replace("#","");
  console.log(newTags);
  newTags=newTags.split("#");
  posts[Number(index)][0]=title;
  posts[Number(index)][2]=content;
  posts[Number(index)][1]=newTags;
  res.redirect("/");
});

app.post("/delete",(req,res)=>{
  const {id}=req.body;
  if(id!=undefined){
    console.log(id);
    posts.splice(Number(id),1);
    res.sendStatus(201);
  }
  else{
    console.log("Delete index not found.");
  }
});
