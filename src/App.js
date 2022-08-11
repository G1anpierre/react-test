import {useState, useEffect} from 'react'
import Modal from 'react-modal'

import './App.css'
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

function App() {
  const [data, setData] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [pagination, setPagination] = useState(1)

  useEffect(() => {
    const getData = async () => {
      console.log('pagination', pagination)
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${pagination}`,
      )
      const json = await response.json()
      setData(json.results)
    }
    getData()
  }, [pagination])

  const handleOpenModal = id => {
    console.log(id)
    setSelectedUser(data.find(user => user.id === id))
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  const handleNext = () => {
    setPagination(pagination + 1)
  }

  const handlePrevious = () => {
    setPagination(pagination - 1)
  }

  return (
    <div className="App">
      <div className="App-container">
        <header className="header">
          <h1>Rich and Morty</h1>
        </header>
        <div className="container">
          {data.map(item => (
            <div
              key={item.id}
              className="card"
              onClick={() => handleOpenModal(item.id)}
            >
              <img src={item.image} alt={item.name} className="card-image" />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        <Modal
          isOpen={selectedUser}
          onRequestClose={handleCloseModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="close-button-container">
            <button onClick={handleCloseModal}>X</button>
          </div>
          {selectedUser && (
            <div>
              <h2>Name: {selectedUser.name}</h2>
              <h3>Species: {selectedUser.species}</h3>
              <h3>Status: {selectedUser.status}</h3>
              <h3>Gender: {selectedUser.gender}</h3>
              <img src={selectedUser.image} alt={selectedUser.name} />
            </div>
          )}
        </Modal>
      </div>
      <div className="pagination">
        <div>
          <button onClick={handlePrevious} className="pagination-buttons">
            Prev
          </button>
          <button onClick={handleNext} className="pagination-buttons">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
