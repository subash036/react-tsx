import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MultiLang from "./components/MultiLang";
import ClientList from "./components/ClientList";
import Nav from 'react-bootstrap/Nav';
import './App.css';
export default class App extends React.Component {
    constructor(props: any) {
        super(props);
    };

    render() {
        return <Router>
            <div className="navigation">
                <Nav
                    activeKey="/multiLang"
                    onSelect={(selectedKey) =>{selectedKey === "comingsoon"?alert(`selected ${selectedKey}`):console.log(`selected ${selectedKey}`)}}
                >
                    <Nav.Item>
                        <Nav.Link href="/multiLang" eventKey="multiLang">Multi language</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/clientList" eventKey="clientList">Client List</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Coming soon">Link 1</Nav.Link>
                    </Nav.Item>
                </Nav>
                <hr />
                <Switch>
                    <Route exact path="/">
                        <MultiLang />
                    </Route>
                    <Route exact path="/multiLang">
                        <MultiLang />
                    </Route>
                    <Route path="/clientList">
                        <ClientList />
                    </Route>
                </Switch>
            </div>
        </Router>
    }
}