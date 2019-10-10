import * as React from 'react';
import request from '../mw/reqClient';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

export default class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      fetchLoader: false,
      items: [],
      createData: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  obj: any = {};
  handleChange(event: any) {
    let getState = this.state.createData;
    getState[event.target.getAttribute('name')] = event.target.value;
    this.setState({ createData: getState });
  }
  handleSubmit(event: any) {
    this.setState({ fetchLoader: true });
    if (!this.state.createData["key"] || '' || !this.state.createData["en"] || '') {
      this.setState({ fetchLoader: false });
      return toast.error("Key and En values rquired", {
        position: toast.POSITION.TOP_RIGHT
      });
    };
    request({
      method: 'POST',
      url: 'createRecord', 
      data: JSON.stringify(this.state.createData)
    })
    // .then(res => res.json())
    .then(
      (resp) => {
        let response = resp.data;
        if(response.errmsg){
          this.setState({ fetchLoader: false });
          return toast.error(response.errmsg, {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        toast.success("New Language Code Created", {
          position: toast.POSITION.TOP_CENTER
        });
        Object.keys(this.state.createData).forEach(key => {
          this.obj[key] = '';
        })
        this.setState({ items: response, createData: this.obj, fetchLoader: false });
      }).catch( (error)=> {
          return toast.error(error, {
            position: toast.POSITION.TOP_RIGHT
          });
      });
    event.preventDefault();
  }

  componentDidMount() {
    request({
      method: 'get',
      url: "masterList",
      responseType: 'json'
    })
      // .then(res => res.json())
      .then(
        (resp) => {
        let response = resp.data;
          this.setState({
            isLoaded: true,
            items: response,
            columns: response.reduce((keys: string[], obj: any) => keys.concat(Object.keys(obj).filter((key: string) => keys.indexOf(key) === -1)), []).map((data: any) => {
              return {
                name: data,
                selector: data,
                sortable: true,
              }
            }),
            columnsnew: response.reduce((keys: string[], obj: any) => keys.concat(Object.keys(obj).filter((key: string) => keys.indexOf(key) === -1)), []).map((data: any) => {
              return {
                columns: [
                  {
                    Header: data,
                    accessor: data,
                    // filterAll: true,
                  }
                ]
              }
            })
          })
        }
      ).catch( (error)=> {
        console.log("SHIVA: componentDidMount -> error", error)
        this.setState({
          isLoaded: true,
          error
        });
      });
  }

  render() {
    const { error, fetchLoader, isLoaded, items, columns, columnsnew } = this.state;
    ;
    if (error) {
      return <div className="loading-outer">
        <div className="loading-inner">
          <span className="error"> <b>Error</b>: {error.message}, Check your API status</span>
        </div>
      </div>;
    }
    else if (!isLoaded) {
      return <div className="loading-outer">
        <div className="loading-inner">
          <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>;
    } else {

      console.log("SHIVA: MyComponent -> render -> items")
      console.log("SHIVA: MyComponent -> render -> items");

      return <div>
        {fetchLoader && (<div className="loading-outer">
          <div className="loading-inner">
            <div className="spinner-grow" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>)}
        <h4 className="text-center">HCM Multilanguage Content Manager</h4>
        <ReactTable
          data={items}
          columns={columnsnew}
          defaultPageSize={100}
          className="-striped -highlight"
          loading={false}
          sortable={true}
          multiSort={true}
          resizable={true}
          filterable={true}
        />
        <div style={{
          "width": "96vw",
          "height": "15vh",
          "display": "inline-block",
          "overflowY": "auto"
        }}>
          <table className="table" style={{
            "textAlign": "center",
            "marginBottom": "0",
            "marginTop": "0"
          }}>
            <tbody>
              <tr>
                {columns.map((data: any) => {
                  return <td style={{
                    "minWidth": "150px"
                  }}><label style={{
                    "textTransform": "uppercase"
                  }}>{data.name}</label>
                    <input type="text" onChange={this.handleChange} value={this.state.createData[data.name]} name={data.name} className="form-control" /></td>
                })}
              </tr>
            </tbody>
          </table></div>
        <div style={{
          "width": "4vw",
          "height": "15vh",
          "display": "inline-block",
          "position": "relative"
        }}>
          <div className="fab" onClick={this.handleSubmit}> + </div>
        </div>
        <ToastContainer />
      </div>
    }

  }
}