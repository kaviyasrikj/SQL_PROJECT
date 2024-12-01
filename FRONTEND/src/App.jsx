import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);  
  const [limit] = useState(5); 

  const [formData, setFormData] = useState({
    Name: '',
    Position: '',
    Salary: ''
  });

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/employees?page=${page}&limit=${limit}`)
      .then(response => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      });
  }, [page, limit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:5000/employees`, formData)
      .then(() => {
        alert('Employees added successfully');
        setFormData({ name: '', position: '', salary: '' });  
        axios.get(`http://localhost:5000/employees?page=${page}&limit=${limit}`)
          .then(response => setEmployees(response.data));
      })
      .catch(error => alert('Error adding employees'));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>Employees Table</h1>

    
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Position:</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Salary:</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Employees</button>
      </form>

      <table border="1" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employees => (
            <tr key={employees.ID}>
              <td>{employees.ID}</td>
              <td>{employees.NAME}</td>
              <td>{employees.POSITION}</td>
              <td>{employees.SALARY}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button onClick={() => setPage(prevPage => prevPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
