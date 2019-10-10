import React from 'react'
import '../login/Login.css';

export default class Login extends React.Component<any, any> {
    componentDidMount() {
    }
    render() {
        return (
            <div style={{
                position:"fixed",
                display: "table",
                height: "100vh",
                width: "100vw",
                left: "0",
                top: "0",
                bottom: "0",
                right: "0",
            }}>
                <div style={{
                    display: "table-cell",
                    height: "100vh",
                    width: "100vw",
                    // alignContent: "center",
                    // textAlign: "center",
                    verticalAlign: "middle"
                }}>
                    <div className="wrapper fadeInDown">
                        <div id="formContent">
                            <div className="logo fadeIn first">
                                <img src="https://essindia.excelityglobal.com/HRWorkWays/media/Images/excelity_logo.png" id="icon" alt="User Icon" />
                            </div>
                            <form>
                                <input type="text" id="login" className="fadeIn second" name="login" placeholder="login" />
                                <input type="text" id="password" className="fadeIn third" name="login" placeholder="password" />
                                <input type="submit" className="fadeIn fourth" value="Log In" />
                            </form>
                            <div id="formFooter">
                                <a className="underlineHover" href="#">Forgot Password?</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
