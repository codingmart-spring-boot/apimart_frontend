import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINT } from '../services/Constant';
import { copyToClipboard } from '../services/helpers';
import { HttpRequest } from '../services/HttpRequest';
import axios from 'axios';
import "./home.css";

function Home() {
  const { logout, useUser } = useAuth();
  const [user, setUser] = useUser();
  const [table, setTable] = useState([{fileName: "", user: ""}]);
  const [uploadFile, setUploadFile] = React.useState();
  const [superHero, setSuperHero] = React.useState();
  
  const submitForm = (event) => {
    event.preventDefault();

    const dataArray = new FormData();
    
    dataArray.append("File", uploadFile);

    axios
      .post("http://localhost:8080/api/v1/collection/upload", dataArray, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        // successfully uploaded response
      })
      .catch((error) => {
        // error response
      });
  };
  
  useEffect(() => {
    const getTableRequest = async () => {
      const requestObj = {
				path: '/collection/get',
				method: 'GET',
				
			};

      const response = await HttpRequest(requestObj);
      if(response.status === true) {
        setTable(response.data);
      }
    }
    getTableRequest();
  }, [])


  const handleLogout = (e) => {
    logout();
  };
  

  

  

	return (
		<div className='upload'>
			<nav class='navbar navbar-expand-lg navbar-light bg-light'>
				<div class='collapse navbar-collapse' id='navbarNav'>
					<ul class='navbar-nav'>
						<li class='nav-item active'>
							<button type='button' class='btn  btn-secondary' style={{marginLeft: '535px'}}>
								<a href='#' style={{textDecoration: 'none', color: 'white'}}>
									Available API's
								</a>
							</button>
						</li>
						<li class='nav-item'>
							<a class='nav-link' href='#' style={{marginLeft: '300px'}}>
								{user.name}
							</a>
						</li>
						<li class='nav-item'>
							<button
								type='button'
								class='btn btn-secondary'
								style={{marginLeft: '30px'}}
								onClick={handleLogout}
							>
								LOG-OUT
							</button>
						</li>
					</ul>
				</div>
			</nav>
			<br />
			<div className='container'>
			<div className="">
			<label style={{marginLeft:"300px"}}>Select File</label>
			<input type="file" name="file" onChange={(e) => setUploadFile(e.target.files)} />
			
			<button type="button" class="btn btn-primary" style={{marginBottom:"10px",marginLeft:"5px"}} onClick={submitForm}>Upload</button>
			</div>
				<table class='table table-bordered'>
					<thead>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>File Name</th>
							<th scope='col'>Endpoint</th>
							<th scope='col'>Copy Link</th>
						</tr>
					</thead>
					<tbody>
						{table.map((item, index) => (
							<tr>
								<th scope='row'>{index + 1}</th>
								<td>{item.user}</td>
								<td>
									<a
										href={`${API_ENDPOINT}collection/${item.user}/${item.fileName}`}
										target='_blank'
									>{`${item.user}/${item.fileName}`}</a>
								</td>
								<td>
									<i
										class='bx bxs-copy bx-sm'
										style={{color: 'black', cursor: 'pointer'}}
										onClick={() =>
											copyToClipboard(`${API_ENDPOINT}collection/${item.user}/${item.fileName}`)
										}
									></i>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Home;
