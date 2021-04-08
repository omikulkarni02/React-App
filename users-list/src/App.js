import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Icon,
  Table,
  Modal,
  Button,
  Form,
  Header,
} from "semantic-ui-react";
import * as moment from "moment"; import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleDOBchange = this.handleDOBchange.bind(this);
    this.deleteUserDetails = this.deleteUserDetails.bind(this);

    this.state = {
      userList: [],
      userDetails: [],
      userId: "",
      name: "",
      dob: null,
      dobUnformat: null,
      email: "",
      gender: "",
      surveys: [],
    };
  }



  clearLocalStorage() {
  }

  componentDidMount() {
    this.getUsers();
  }

  handleDOBchange = async (date) => {
    await this.setState({
      dobUnformat: date,
    });
    await this.setState({
      dob: moment(this.state.dobUnformat).format("DD/MM/YYYY"),
    });
  };


  async getUsers() {
    let tmp = [];
    await axios.get("https://dashboard-api.bounceinsights.com/misc/sampleUsers").then((response) => {
      tmp = response.data.users;
    },(error)=>{
      console.log(error);
    });
    this.setState({ userList: tmp });
  }

  getUserDetails(user_data) {
    this.setState({ userDetails: user_data });
  }

  updateUserDetails(user_details) {
    let tmp = this.state.userList;
    for (var i = 0; i < tmp.length; i++) {
      if (user_details.userId == tmp[i].userId) {
        if (this.state.name != "") {
          tmp[i].name = this.state.name
        }
        if (this.state.dob != null) {
          tmp[i].dateOfBirth = this.state.dob
        }
        if (this.state.email != "") {
          tmp[i].email = this.state.email
        }
        if (this.state.gender != "") {
          tmp[i].gender = this.state.gender
        }
        if (this.state.surveys != "") {
          let arr = this.state.surveys.split(",");
          tmp[i].surveys = arr;
        }
      }
    }

    this.setState({ userList: tmp, openEditModal: false });

  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  deleteUserDetails(details) {
    let tmp = [];
    for (var i = 0; i < this.state.userList.length; i++) {
      if (this.state.userList[i].userId != details.userId) {
        tmp.push(this.state.userList[i]);
      }
    }

    this.setState({ userList: tmp, openDeleteModal: false });

  }

  addUser() {
    
    let numbers = []
    
    for(var i=0;i<this.state.userList.length;i++){
      numbers.push(this.state.userList[i].userId);
    }

    let current = Math.max.apply(null,numbers);
    
    let tmp = {
      userId: current + 1,
      name: this.state.name,
      dateOfBirth: this.state.dob,
      email: this.state.email,
      gender: this.state.gender,
      registeredAt: new Date().toLocaleString(),
      surveys: [this.state.surveys]
    }
    this.state.userList.push(tmp);
    this.setState({ openAddModal: false });

  }

  printUserList() {

    let lst = this.state.userList;

    return lst.map((user_data, index) => (
      <Table.Row key={index}>
        <Table.Cell >{user_data.userId}</Table.Cell>
        <Table.Cell collapsing>{user_data.name}</Table.Cell>
        <Table.Cell collapsing>{new Date(user_data.dateOfBirth).toLocaleString()}</Table.Cell>
        <Table.Cell collapsing>{user_data.email}</Table.Cell>
        <Table.Cell collapsing>{user_data.gender}</Table.Cell>
        <Table.Cell collapsing>{new Date(user_data.registeredAt).toLocaleString()}</Table.Cell>
        <Table.Cell collapsing>{user_data.surveys}</Table.Cell>


        <Table.Cell collapsing>
          <Modal
            style={{ width: 350 }}
            open={this.state.openEditModal}
            trigger={

              <Link
                onClick={async (e) => {
                  this.setState({ openEditModal: true });
                  this.getUserDetails(user_data);
                }}
              >
                <Header as="h6" icon style={{ marginBottom: 0 }}>
                  <Icon name="edit" />
                    Edit
                  </Header>
              </Link>
            }
            centered={true}
          >
            <Modal.Header>Edit User</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Input
                  label="Name"
                  name="name"
                  type="name"
                  placeholder={this.state.userDetails.name}
                  onChange={this.handleChange}
                />

                <Form.Field
                  label="Date of birth"
                  style={{ marginBottom: 0 }}
                />
                <DatePicker
                  value={this.state.dob}
                  onChange={date => this.handleDOBchange(date)}
                  showMonthDropdown
                  useShortMonthInDropdown
                  showYearDropdown
                  fixedHeight
                  isClearable
                  maxDate={new Date()}
                  showPopperArrow={false}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={new Date(this.state.userDetails.dateOfBirth).toLocaleDateString()}
                  dropdownMode="select"
                />

                <Form.Field />
                <Form.Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder={this.state.userDetails.email}
                  onChange={this.handleChange}
                />
                <Form.Dropdown
                  placeholder={this.state.userDetails.gender}
                  clearable
                  fluid
                  selection
                  value={this.state.gender}
                  label="Gender"
                  name="dropdown"
                  options={[
                    {
                      key: "Male",
                      text: "Male",
                      value: "Male",
                    },
                    {
                      key: "Female",
                      text: "Female",
                      value: "Female",
                    },
                    { key: "Other", text: "Other", value: "Other" },
                  ]}
                  onChange={(e, { value }) =>
                    this.setState({ gender: value })
                  }
                />
                <Form.Input
                  label="Surveys"
                  name="surveys"
                  type="surveys"
                  placeholder={this.state.userDetails.surveys}
                  onChange={this.handleChange}
                />
              </Form>

            </Modal.Content>
            <Modal.Actions>
              <Button
                floated="left"
                inverted
                color="red"
                onClick={this.closeEditModal}
              >
                Cancel
							</Button>
              {!this.state.makeChanges ? (
                <Button
                  color="green"
                  onClick={() => this.updateUserDetails(this.state.userDetails)}
                  style={{ marginRight: 11 }}
                >
                  Confirm
                </Button>
              ) : (
                  <Button
                    loading
                    color="green"
                    onClick={() => this.updateUserDetails(this.state.userDetails)}
                    style={{ marginRight: 11 }}
                  >
                    Confirm
                  </Button>
                )}
            </Modal.Actions>
          </Modal>

                &nbsp; &nbsp;

          <Modal
            style={{ width: 350 }}
            open={this.state.openDeleteModal}
            trigger={

              <Link
                onClick={async (e) => {
                  this.setState({ openDeleteModal: true });
                  this.getUserDetails(user_data);
                }}
              >
                <Header as="h6" icon style={{ marginBottom: 0 }}>
                  <Icon name="delete" />
                    Delete
                  </Header>
              </Link>
            }
            centered={true}
          >
            <Header
              content="Are you sure you want to delete?"
            />
            <Modal.Actions>
              <Button
                color="red"
                onClick={this.closeDeleteModal}
              >
                <Icon name="remove" /> No
							</Button>
              <Button color="green" inverted onClick={() => this.deleteUserDetails(this.state.userDetails)}>
                <Icon name="checkmark" /> Yes
							</Button>
            </Modal.Actions>
          </Modal>

        </Table.Cell>

      </Table.Row>
    ));
  }

  openEditModal = () => this.setState({ openEditModal: true });
  closeEditModal = () => this.setState({ openEditModal: false });

  openDeleteModal = () => this.setState({ openDeleteModal: true });
  closeDeleteModal = () => this.setState({ openDeleteModal: false });

  openAddModal = () => this.setState({ openAddModal: true });
  closeAddModal = () => this.setState({ openAddModal: false });

  render() {

    return (
      <div style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 100 }}>
        <Table size="large" celled style={{ marginTop: 35 }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User Id</Table.HeaderCell>
              <Table.HeaderCell >Name</Table.HeaderCell>
              <Table.HeaderCell >Date of birth</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell >Gender</Table.HeaderCell>
              <Table.HeaderCell>Registered At</Table.HeaderCell>
              <Table.HeaderCell>Surveys</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.printUserList()}</Table.Body>
        </Table>

        <Container textAlign="center" style={{ width: 400 }}>


          <Modal
            style={{ width: 350 }}
            open={this.state.openAddModal}
            trigger={

              <Button
                style={{ marginTop: 25 }}
                fluid
                content="Add User"
                type="submit"
                color="blue"
                onClick={async (e) => {
                  this.setState({ openAddModal: true });
                }}
              />

            }
            centered={true}
          >
            <Modal.Header>Add User</Modal.Header>
            <Modal.Content>
              <Form>
                {/* <Form.Input
                  label="User Id"
                  name="userId"
                  type="userId"
                  placeholder="Please user id"
                  onChange={this.handleChange}
                /> */}

                <Form.Input
                  label="Name"
                  name="name"
                  type="name"
                  placeholder="Please enter name"
                  onChange={this.handleChange}
                />

                <Form.Field
                  label="Date of birth"
                  style={{ marginBottom: 0 }}
                />
                <DatePicker
                  value={this.state.dob}
                  onChange={date => this.handleDOBchange(date)}
                  showMonthDropdown
                  useShortMonthInDropdown
                  showYearDropdown
                  fixedHeight
                  isClearable
                  maxDate={new Date()}
                  showPopperArrow={false}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Please enter DOB"
                  dropdownMode="select"
                />

                <Form.Field />
                <Form.Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Please enter email id"
                  onChange={this.handleChange}
                />
                <Form.Dropdown
                  placeholder="Please select gender"
                  clearable
                  fluid
                  selection
                  value={this.state.gender}
                  label="Gender"
                  name="dropdown"
                  options={[
                    {
                      key: "Male",
                      text: "Male",
                      value: "Male",
                    },
                    {
                      key: "Female",
                      text: "Female",
                      value: "Female",
                    },
                    { key: "Other", text: "Other", value: "Other" },
                  ]}
                  onChange={(e, { value }) =>
                    this.setState({ gender: value })
                  }
                />
                <Form.Input
                  label="Surveys"
                  name="surveys"
                  type="surveys"
                  placeholder="Please add surveys"
                  onChange={this.handleChange}
                />
              </Form>

            </Modal.Content>
            <Modal.Actions>
              <Button
                floated="left"
                inverted
                color="red"
                onClick={this.closeAddModal}
              >
                Cancel
							</Button>
              <Button
                color="green"
                onClick={() => this.addUser()}
                style={{ marginRight: 11 }}
              >
                Confirm
                  </Button>
            </Modal.Actions>
          </Modal>



        </Container>
      </div>

    );
  }
}
