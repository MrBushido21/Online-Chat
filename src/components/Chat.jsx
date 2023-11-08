import { useEffect, useState } from "react";
import io from "socket.io-client"
import { useLocation, useNavigate } from "react-router-dom"
import icon from "../images/emoji.svg"
import EmojiPicker from "emoji-picker-react";

import s from "../styles/Chat.module.css"
import { Messages } from "./Messages";

const socket = io.connect('https://online-chat-xyxo.onrender.com')

export const Chat = () => {
    const { search } = useLocation()
    const [params, setParams] = useState({ room: "", user: "" })
    const [state, setState] = useState([])
    const [message, setMessage] = useState("")
    const [isOpen, setOpen] = useState(false)
    const [users, setUsers] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setParams(searchParams)
        socket.emit('join', searchParams)
    }, [search])

    useEffect(() => {
        socket.on("message", ({ data }) => {
          setState((_state) => [..._state, data]);
        });
      }, []);
    useEffect(() => {
        socket.on("room", ({ data: { users } }) => {
          setUsers(users.length);
        });
      }, []);

    const leftRoom = () => { 
        socket.emit("leftRoom", { params })
        navigate("/")
    }
    const handleChange = ({ target: { value } }) => setMessage(value)
    const handleSubmit = (e) => { 
        e.preventDefault();

        if(!message) return

        socket.emit("sendMessage", { message, params })

        setMessage("")
    }
    const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`)

    return (
        <div className={s.wrap}>
            <div className={s.header}>
                <div className={s.title}>{params.room}</div>
                <div className={s.users}>{users} users in this room</div>
                <button className={s.left} onClick={leftRoom}>Left room</button>
            </div>
            <div className={s.messages}>
                <Messages messages={state} name={params.name} />
            </div>

            <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.input}>
                    <input
                        type="text"
                        name="message"
                        placeholder="Write.."
                        value={message}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={s.emoji}>
                    <img src={icon} onClick={() => setOpen(!isOpen)} />

                    {isOpen && (
                        <div className={s.emojies}>
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>

                <div className={s.button}>
                    <input type="submit" onSubmit={handleSubmit} value="Send a message" />
                </div>
            </form>
        </div>
    );
}