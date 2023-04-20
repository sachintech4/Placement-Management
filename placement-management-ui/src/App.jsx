import {Button, TextField, defaultTheme, Provider} from '@adobe/react-spectrum';
import './App.css'
import { useState, useEffect } from 'react';
import { db } from "./firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";


function App() {

const [name, setName] = useState([]);
const [age, setAge] = useState([]);


const [users, setusers] = useState([]);
const usersCollectionRef = collection(db, "users");

const addUser = async () => {
  await addDoc(usersCollectionRef, {name: name, age: number(age)});
};

const updateUser = async (id, age) => {
  const userDoc = doc(db, "users", id);
  const newFields = {age: age + 1}
  await updateDoc(userDoc, newFields);
};

const deleteUser = async (id) => {
  const userDoc = doc(db, "users", id);
  await deleteDoc(userDoc);

}

useEffect(() => {
  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setusers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  };
  getUsers();
}, [])

  return (
    <Provider 
    height={"100vh"}
    width={"100vw"}
    theme={defaultTheme}>
    <div className='App'>

        <TextField
        label="name" 
        onChange={setName}
        type="string"/>
        <TextField
        label="age" 
        onChange={setAge}
        type="number"/>

        <Button
        variant="accent"
        onPress={addUser}
      >
        Add User
      </Button>
        

      {users.map((user) => {
        return (
          <div>
            <p>{user.name}</p>
            <p>{user.age}</p>
            <p>{user.id}</p>
            <Button
               variant="accent"
               onPress={() => {updateUser(user.id, user.age)}}
            >
            Increase Age
            </Button>
            <Button
        variant="accent"
        onPress={() => {deleteUser(user.id)}}
      >
        Delete User
      </Button>
          </div>
        )
      })}
    </div>
    </Provider>
  );
 
}

export default App;