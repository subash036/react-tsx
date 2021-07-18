import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseApi, PROD, UAT, QA } from "../common/urls"
import '../App.css';
import axios from 'axios';
import Select from 'react-select';
const options = [
  { value: 'PROD', label: 'Live' },
  { value: 'UAT', label: 'UAT' },
  { value: 'QA', label: 'QA' },
];

class ClientList extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            fetchLoader: false,
            items: [],
            createData: {
            },
            ENV:{ value: 'PROD', label: 'Live' },
            url:PROD
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    state: any = {

        // Initially, no file is selected
        selectedFile: null
    };

    obj: any = {};
    handleChange(event: any) {
        let getState = this.state.createData;
        if(event['label']){
            this.state["ENV"] = event;
            this.componentDidMount();
        }else{
            getState[event.target.getAttribute('name')] = event.target.value;
        };
        this.setState({ createData: getState});
        
    }
    handleSubmit(event: any) {
        this.setState({ fetchLoader: true });
        if (!this.state.selectedFile || '' || !this.state.createData["mailTo"] || '' || !this.state.createData["usr_name"] || '' || !this.state.createData["clnt_nm"] || '' || !this.state.createData["isDayforce"] || '') {
            this.setState({ fetchLoader: false });
            return toast.error("Please enter all required fields", {
                position: toast.POSITION.TOP_RIGHT
            });
        };
        this.onFileUpload().then((resp) => {
            fetch((this.state.ENV.value === "PROD"? PROD: this.state.ENV.value === "UAT"? UAT:this.state.ENV.value === "QA"? QA:baseApi) + 'intiateProcess', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...this.state.createData,...resp.data})
            }).then(res => res.json()).then((result:any) => {
                    console.log("🚀 ~ file: ClientList.tsx ~ line 55 ~ ClientList ~ this.onFileUpload ~ result", result);
                    this.setState({ fetchLoader: false });
                    return toast.success(result, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }).catch(err=>{
                    toast.error(err.toString(), {
                        position: toast.POSITION.TOP_RIGHT
                    });
                });
        }).catch(() => {
            this.setState({ fetchLoader: false });
            toast.error("File Upload Failed", {
                position: toast.POSITION.TOP_RIGHT
            });
        });

        event.preventDefault();
    }

    componentDidMount() {
        fetch((this.state.ENV.value === "PROD"? PROD: this.state.ENV.value === "UAT"? UAT:this.state.ENV.value === "QA"? QA:baseApi)+ "getclient")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result,
                        columns: result.reduce((keys: string[], obj: any) => keys.concat(Object.keys(obj).filter((key: string) => keys.indexOf(key) === -1)), []).map((data: any) => {
                            return {
                                name: data,
                                selector: data,
                                sortable: true,
                            }
                        }),
                        columnsnew: result.reduce((keys: string[], obj: any) => keys.concat(Object.keys(obj).filter((key: string) => keys.indexOf(key) === -1)), []).map((data: any) => {
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
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log("SHIVA: componentDidMount -> error", error)
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    // On file select (from the pop up)
    onFileChange = (event: any) => {

        // Update the state
        this.setState({ selectedFile: event.target.files[0] });

    };

    // On file upload (click the upload button)
    onFileUpload = () => {
        
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "content",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        // Details of the uploaded file
        console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        return axios.post(baseApi + 'uploadClientFile', formData);
    };

    // File content to be displayed after
    // file upload is complete
    fileData = () => {

        if (this.state.selectedFile) {

            return (
                <div>
                    <h2>File Details:</h2>

                    <p>File Name: {this.state.selectedFile.name}</p>


                    <p>File Type: {this.state.selectedFile.type}</p>


                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>

                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };
    filterMethod = (filter: any, row: any) => {
        const id = filter.pivotId || filter.id
        return row[id] !== undefined ? String(!isNaN(row[id]) ? row[id] : row[id].toLowerCase()).includes(!isNaN(filter.value) ? filter.value : filter.value.toLowerCase()) : true
    }
    render() {
        const { error, fetchLoader, isLoaded, items, columnsnew } = this.state;
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
                <h4 className="text-center">HCM <Select className="select-box"
                                onChange={this.handleChange} 
                                value={this.state['ENV']} name="ENV"
                                options={options}
                            /> Clients/Schema</h4>
                <ReactTable
                    defaultFilterMethod={this.filterMethod}
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
                        "marginBottom": "0"
                    }}>
                        <tbody>
                            <tr>
                                <td style={{
                                    "minWidth": "150px"
                                }}><label style={{
                                    "textTransform": "uppercase"
                                }}>Client Name<sup className="red">*</sup></label>
                                    <input type="text" onChange={this.handleChange} value={this.state.createData['clnt_nm']} name="clnt_nm" className="form-control" /></td>
                                <td style={{
                                    "minWidth": "150px"
                                }}><label style={{
                                    "textTransform": "uppercase"
                                }}>Implementation Owner<sup className="red">*</sup></label>
                                    <input type="text" onChange={this.handleChange} value={this.state.createData['usr_name']} name="usr_name" className="form-control" /></td>
                                <td style={{
                                    "minWidth": "150px"
                                }}><label style={{
                                    "textTransform": "uppercase"
                                }}>Mail To<sup className="red">*</sup></label>
                                    <input type="text" onChange={this.handleChange} value={this.state.createData['mailTo']} name="mailTo" className="form-control" /></td>
                                <td style={{
                                    "minWidth": "150px"
                                }}><label style={{
                                    "textTransform": "uppercase"
                                }}>Is Dayforce Client<sup className="red">*</sup></label>
                                    <select onChange={this.handleChange} value={this.state.createData['isDayforce']} name="isDayforce" className="form-control">
                                        <option value="">
                                            Select Type
                                        </option>
                                        <option value="true">
                                            Yes
                                        </option>
                                        <option value="false">
                                            No
                                        </option>
                                    </select>

                                </td>
                                <td>
                                    <label style={{
                                        "textTransform": "uppercase"
                                    }}>Upload Schema Request Excel<sup className="red">*</sup></label>
                                    <input value={this.state.createData['content']} className="form-control" type="file" onChange={this.onFileChange} />
                                </td>
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

    };
}
export default ClientList;
