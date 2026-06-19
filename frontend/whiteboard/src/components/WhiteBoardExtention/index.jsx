import React,{Component} from 'react'
import { useParams, useLocation} from 'react-router-dom';

import {io} from 'socket.io-client'

import "./index.css"

class WhiteBoard extends Component{
    constructor (props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state={
            draw: false,
            strokes: [],
            message: "",
            messages: [],
        }
        this.currentStroke = []
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        const roomId = this.props.roomId.id
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        this.socket = io("https://real-time-whiteboard-tgia.onrender.com")
        this.socket.on("connect", () => {
            console.log("socket id", this.socket.id);
            this.socket.emit("join", roomId)
        });
        this.socket.on("mess",(data) => {
            const lol = {userName: data.userName,message: data.message}
            this.setState(prev =>({
                messages: [...prev.messages,lol]
            }))
        })
        this.socket.on("stop",(data) => {
            console.log(data)
            ctx.beginPath();
            data.forEach((point,index) => {
                if(index == 0) {
                    ctx.moveTo(
                        point.x,
                        point.y
                    );
                } else {
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                }
            })
            console.log("remote")
            this.setState( prev => ({
            strokes: [...prev.strokes,data],
            draw: false,
        }));
            ctx.beginPath();
        })
        this.socket.on("undo",( ) => {
            console.log("undo happening",1)
            const {strokes} = this.state
            console.log(strokes)
            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            )

            let nstrokes=[...strokes]
            nstrokes.pop()
            console.log(nstrokes)
            this.setState({strokes: nstrokes},() =>{
                nstrokes.forEach(ele => {
                    ele.forEach((point,index) => {
                        if(index == 0) {
                            ctx.beginPath();
                            ctx.moveTo(
                                point.x,
                                point.y
                            );
                        } else {
                            ctx.lineTo(point.x, point.y);
                            ctx.stroke();
                        }
                    })
                    ctx.beginPath();
                })
            })
        })
    }

    componentWillUnmount() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    startDrawing = (e) => {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        this.currentStroke = []

        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.beginPath();

        ctx.moveTo(x, y);

        this.currentStroke.push({x,y})

        this.setState({
            draw: true
        });
    }

    draw = (e) => {

        if (!this.state.draw) return;


        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();


        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);


        ctx.lineTo(x, y);
        ctx.stroke();
        this.currentStroke.push({x,y})

    }

    stopDrawing = () => {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        const roomId = this.props.roomId.id
        if(this.currentStroke.length === 0) {
            return;
        }
        const finished = [...this.currentStroke]
        console.log("local")
        this.setState( prev => ({
            strokes: [...prev.strokes,finished],
            draw: false,
        }),() => {this.socket.emit("stop",{currentStroke: finished,roomId})});
        ctx.beginPath();
        
        this.currentStroke=[]
    }

    clicked = () => {
        const {strokes} = this.state
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        const roomId = this.props.roomId.id;
        this.socket.emit("undo",{roomId})
        console.log(strokes)
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        )

        let nstrokes=[...strokes]
        nstrokes.pop()
        console.log(nstrokes)
        this.setState({strokes: nstrokes},() =>{
            nstrokes.forEach(ele => {
                ele.forEach((point,index) => {
                    if(index == 0) {
                        ctx.beginPath();
                        ctx.moveTo(
                            point.x,
                            point.y
                        );
                    } else {
                        ctx.lineTo(point.x, point.y);
                        ctx.stroke();
                    }
                })
                ctx.beginPath();
            })
        })
    }

    cha = event => {
        this.setState({message: event.target.value})
    }

    cli = () => {
        const {message} = this.state
        const userName = this.props.userName
        const roomId = this.props.roomId.id
        this.socket.emit("mess",{message,userName,roomId})
        this.setState({message: ""})
    }

    render() {
        const roomId = this.props.roomId.id
        const {messages, message} = this.state
        return(
            <div className="bg">
                <div className='card'>
                    <p>RoomId : {roomId} </p>
                    <button onClick = {this.clicked} className='but1'>
                        undo
                    </button>
                </div>
                <div className='card'>
                    <div className="top">
                        <canvas 
                            ref={this.canvasRef}
                            width={900}
                            height={600}
                            style={{
                                border:"1px solid black"
                            }}
                            onMouseDown={this.startDrawing}
                            onMouseMove={this.draw}
                            onMouseUp={this.stopDrawing}
                            onMouseLeave={this.stopDrawing}
                        >
                        </canvas>
                    </div>
                    <div className='chat'>
                        <ul>
                            {messages.map((each,index) => (
                                <li key={index}>{each.userName}: {each.message}</li>
                            ))}
                        </ul>
                        <div className='card'>
                            <input value={message} className= "inn" onChange={this.cha} type="text"/>
                            <button className= "but2" onClick={this.cli}>Send</button>
                        </div> 
                    </div>
                </div>
            </div>
        )
    } 
}

const WhiteBoardExtention = () => {
    const roomid = useParams()
    const location = useLocation()
    return <WhiteBoard  roomId={roomid} userName={location.state.userName}/>
}

export default WhiteBoardExtention
