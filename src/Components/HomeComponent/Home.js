
import style from "./Home.module.css";
import pic1 from "../../images/1.jpeg";
import pic2 from "../../images/2.png";
import pic3 from "../../images/3.png";

import { NavLink } from "react-router-dom";



function Home() {
    return (
        <>
            <div id={style.header}>
                <div id={style.headerHeadingBox}>
                    <h3>ONLINE ASSESSMENT PLATFORM</h3>
                </div>
            </div>

            <div id={style.div1}>
                <img src={pic1} alt="" />
                <span>ONLINE ASSESSMENT PLATFORM</span>
            </div>


            <div id={style.div2}>

                <div className={style.div3}>
                    <NavLink exact to="/StudentLogin">
                        <img src={pic2} alt="" />
                        <span>Student</span>
                    </NavLink>
                </div>

                <div className={style.div3}>
                    <NavLink to="/AdminLogin">
                        <img src={pic3} alt="" />
                        <span>Admin</span>
                    </NavLink>
                </div>

            </div>




        </>
    );
}



export default Home;