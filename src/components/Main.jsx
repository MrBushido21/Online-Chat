import { Link } from "react-router-dom";
import s from "../styles/Main.module.css"
import { useState } from "react";

const FIELDS = {
    USERNAME: "username",
    ROOM: "room",
}

export const Main = () => {
    const { USERNAME, ROOM } = FIELDS

    const [values, setValues] = useState({ [USERNAME]: "", [ROOM]: "" })


    const handleChange = ({ target: { value, name } }) => {
        setValues({ ...values, [name]: value})
    }

    const handleClick = (e) => {
        const isDisabled = Object.values(values).some((value) => !value)

        if(isDisabled) e.preventDefault()
    }
return (
<div className={s.wrap}>
    <div className={s.container}>
        <h1 className={s.heading}>Join</h1>

        <form className={s.form}>
            <div className={s.group}>
                <input type="text" 
                name="username"
                placeholder="Username"
                value={values[USERNAME]}
                className={s.input}
                onChange={handleChange}
                required
                />
            </div>
            <div className={s.group}>
                <input type="text" 
                name="room"
                placeholder="Room"
                value={values[ROOM]}
                className={s.input}
                onChange={handleChange}
                required
                />
            </div>

            <Link to={`/chat?name=${values[USERNAME]}&room=${values[ROOM]}`}
            onClick={handleClick}
            >
            <button type="submit" className={s.button}>
                Sign In
            </button>
            </Link>
        </form>
    </div>
</div>
);
}