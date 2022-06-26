
let canvas=document.getElementById("canvas");
let ctx=canvas.getContext("2d");
ctx.fillStyle="rgb(0,0,0)";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let dist=0;
//SPIKES
let tri_width=Math.floor(canvas.width/12)
let tri_start_coord=0;
let dir_arr=[1.25,-1.25,1.5,-1.5,2,-2,-2.5,2.5];
let spawn_platform=[];
let playagain=document.querySelector(".playagain");
let ready=document.querySelector(".start");
let rdy=0;
ready.addEventListener("click",function rdy(){
    
    countdown();
    ready.removeEventListener("click",rdy)
    
    
    
})

let high_Sco=JSON.parse(localStorage.getItem("high_Sco")) || [];
function time(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,ms);
    })
}

function drawspikes(){
    tri_start_coord=0;
    //console.log("called")
    for(let i=0;i<12;i++){
        ctx.beginPath();
        ctx.fillStyle="rgb(162, 123, 92)"
        ctx.moveTo(tri_start_coord,0);
        ctx.lineTo(tri_start_coord+tri_width,0);
        ctx.lineTo(tri_start_coord+tri_width/2,50);
        ctx.fillStyle="rgb(162, 123, 92)"
        ctx.fill();
        tri_start_coord+=tri_width;
    }
}
function draw_life(x,y){
    ctx.beginPath();
    
    ctx.lineWidth="4"
    
    ctx.moveTo(x,y);
    ctx.lineTo(x+10,y);
    ctx.strokeStyle="white"
    ctx.stroke();
    
    ctx.moveTo(x,y);
    ctx.lineTo(x,y+10);
    ctx.strokeStyle="white"
    ctx.stroke();
   
    ctx.moveTo(x,y);
    ctx.lineTo(x,y-10);
    ctx.strokeStyle="white"
    ctx.stroke();
    
    ctx.moveTo(x,y);
    ctx.lineTo(x-10,y);
    ctx.strokeStyle="white"
    ctx.stroke();
    
    ctx.lineWidth="10"

}
playagain.addEventListener("click",function (){
    rdy=0;
    window.location.reload();
})
let x_coords=[];
for(let i=10;i<850;i+=10){
    x_coords.push(i);
}
let y_coords=[140,170,200,230,260,290,320,350,380,410,440,470,500,530,560,590,620,650,680,710,740,770,800];
function randomx_co_ord(){
    let randx=Math.floor(Math.random()*x_coords.length);
    return x_coords[randx];
}
function randomy_co_ord(){
    let randy=Math.floor(Math.random()*y_coords.length);
    return y_coords[randy];
}
//platform
function drawplatform(i){
    let rand_x=randomx_co_ord();
    let rand_y=randomy_co_ord();
    ctx.beginPath();
    ctx.lineWidth="10";
    ctx.moveTo(rand_x,y_coords[i]);
    ctx.lineTo(rand_x+100,y_coords[i]);
    ctx.strokeStyle="green";
    ctx.stroke();
}
function draw_gmover(){
    savehighscore();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, (canvas.height/2)-50);
    ctx.fillText(`SCORE : ${dist}`, canvas.width/2, (canvas.height/2));
    ctx.fillText(`BEST SCORE : ${high_Sco.map(function(a) {return a.Points;})}`, canvas.width/2, (canvas.height/2)+50);
}
class Ball{
    constructor(x,y,color){
        this.x=x;
        this.y=y;
        this.color=color;
        this.gravity=1.5
        
        this.velocity={
            x:4,
            y:1
        }
    }
    drawball(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    break(){
        console.log("break applied")
        this.y=this.y+this.velocity.y*this.break.y
    }
    update(){
        this.y=this.y+this.gravity
    }
    update_left(){
        console.log("left")
        this.x=this.x-this.velocity.x
        //this.y=this.y-2
    }
    update_up(){
        this.y=this.y-this.velocity.y-3
    }
    update_right(){
        console.log("right")
        this.x=this.x+this.velocity.x
        //window.requestAnimationFrame(update_right)   
    }
    update_down(){
        console.log("down")
        //this.y=this.y+this.velocity.y
    }
   
    update_dir_vel(obj){
        this.x=this.x+obj.velocity.x
        this.y=this.y+obj.velocity.y-0.5
    }
   
}
class Platform{
    constructor(color,x_start,y_start,x_end,y_end,velocity_dir){
        this.x_start=x_start,
        this.y_start=y_start,
        this.x_end=x_end,
        this.y_end=y_end,
        this.velocity_dir=velocity_dir,
        this.velocity={
            
            x:velocity_dir,
            y:0
        }
        this.color=color
    }
    draw(){
        ctx.beginPath();
        ctx.lineWidth="10";
        ctx.moveTo(this.x_start,this.y_start);
        ctx.lineTo(this.x_end,this.y_end);
        ctx.strokeStyle=this.color;
        ctx.stroke();
    }
    update(){
        if(this.x_start>0 && this.x_start<3){
            this.velocity.x*=-1
        }
        else if(this.x_end>897 && this.x_end<900){
            this.velocity.x*=-1
            
        }
        this.x_start=this.x_start+this.velocity.x,
        this.x_end=this.x_end+this.velocity.x,
        this.y_start=this.y_start+this.velocity.y,
        this.y_end=this.y_end+this.velocity.y
    }
    movePlatform(){
        this.y_start=this.y_start-0.5,
        this.y_end=this.y_end-0.5
    }
}
var ball=new Ball(canvas.width/2,100,"blue")
for(let i=0;i<y_coords.length;i++){
    let x=randomx_co_ord();
    spawn_platform.push(new Platform("green",x,y_coords[i],x+100,y_coords[i],dir_arr[Math.floor(Math.random()*8)]));
}
let x1,y1,x2,y2;
let x_life=randomx_co_ord();
let y_life=randomy_co_ord();
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawspikes();
    x1=ball.x;
    y1=ball.y;
    
    //collision-detection
    let collision=0;
    let index_platform;
    
    for(let i=0;i<spawn_platform.length;i++){
        if(spawn_platform[i].y_start-5==50){
            console.log("SPIKE COLLLISION");
            spawn_platform[i].color="transparent"

        }
        if(ball.x>=spawn_platform[i].x_start-15 && ball.x<=spawn_platform[i].x_end+20 && (ball.y+10)>=(spawn_platform[i].y_start-5) && (ball.y+10)<=(spawn_platform[i].y_start+5)){
            console.log("collision detected");
            collision=1;
            index_platform=i;
            spawn_platform[i].y_start=spawn_platform[i].y_start-1;
            spawn_platform[i].y_end=spawn_platform[i].y_end-1
            ball.y-=1.5
        }
        
        spawn_platform[i].movePlatform();
    }
    if(collision==0){
        ball.update();
    }
    for(let i=0;i<spawn_platform.length;i++){
        
        spawn_platform[i].update();
        spawn_platform[i].draw();
    }
    if((ball.y-10>=0 && ball.y-10<=50)||(ball.y+10>=canvas.height-5 && ball.y+10<=canvas.height)||(ball.x-10>=0 && ball.x-10<=10)||(ball.x+10>=canvas.width-5 && ball.x+10<=canvas.width)){
        draw_gmover();
        return;
    }
    x2=ball.x;
    y2=ball.y;
    calc_dist(x1,y1,x2,y2);
    ball.drawball();
    
    requestAnimationFrame(animate);
}

function calc_dist(x1,y1,x2,y2){
    console.log(typeof(x1));
    let delta_x=(x2-x1)*(x2-x1);
    let delta_y=(y2-y1)*(y2-y1);
    console.log(delta_y)
    dist+=Math.sqrt(delta_x+delta_y)
    //console.log(dist);
}
function addPlatforms(){
    let ran=Math.floor(Math.random()*2)
    let ycrd=[590,620]
    let x=randomx_co_ord();
    spawn_platform.push(new Platform("green",x,ycrd[ran],x+100,ycrd[ran],dir_arr[Math.floor(Math.random()*8)]));
}




document.addEventListener("keydown",function kdo(event){
    if(event.key=="ArrowLeft"){
        ball.update_left()
    }
    if(event.key=="ArrowUp"){
        ball.update_up()
    }
    if(event.key=="ArrowRight"){
        ball.update_right()
    }
    if(event.key=="ArrowDown"){
        ball.update_down()
    }
    if(event.key=="ArrowLeft" && event.key=="ArrowDown"){
        ball.update_left();
        ball.update_down();
    }
    if(event.key=="ArrowRight" && event.key=="ArrowDown"){
        ball.update_right();
        ball.update_down();
    }
    
})

function savehighscore(){
    let data={
        Points: dist
    }
    high_Sco.push(data);
    high_Sco.sort((a,b)=> b.Points-a.Points);
    high_Sco.splice(1);
    localStorage.setItem("high_Sco",JSON.stringify(high_Sco));
   

}
function start(){
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("PRESS READY TO START", canvas.width/2, canvas.height/2);
    
}
async function countdown(){
    for(let i=3;i>0;i--){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="rgb(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "60px Comic Sans MS";
        ctx.fillStyle = "orange";
        ctx.textAlign = "center";
        ctx.fillText(`${i}`, canvas.width/2, canvas.height/2);
        await time(1000);
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "60px Comic Sans MS";
    ctx.fillStyle = "orange";
    ctx.textAlign = "center";
    ctx.fillText("PLAY", canvas.width/2, canvas.height/2);
    await time(500);
    setInterval(addPlatforms,1200)
    animate();
}
start();