import {useState} from 'react'
import {useQuery} from '@tanstack/react-query'
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
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(false)

  const fetchProjects = async (page = 1) => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${page}`,
    )
    const data = await response.json()
    return data
  }

  const {isLoading, isError, error, data, isFetching, isPreviousData} =
    useQuery(['characters', page], () => fetchProjects(page), {
      keepPreviousData: true,
    })

  const handleOpenModal = id => {
    setSelectedUser(data.results.find(user => user.id === id))
  }

  const handleCloseModal = () => {
    setSelectedUser(false)
  }

  return (
    <div className="App">
      <div className="App-container">
        <header className="header">
          <h1>Rich and Morty</h1>
        </header>
        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error: {error.message}</div>
          ) : (
            <div className="container">
              {data?.results.map(item => (
                <div
                  key={item.id}
                  className="card"
                  onClick={() => handleOpenModal(item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-image"
                  />
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <Modal
          isOpen={!!selectedUser}
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
          <button
            onClick={() => setPage(old => Math.max(old - 1, 0))}
            disabled={page === 1}
            className="pagination-buttons"
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => {
              if (!isPreviousData && data.info.next) {
                setPage(old => old + 1)
              }
            }}
            // Disable the Next Page button until we know a next page is available
            disabled={isPreviousData || !data?.info.next}
            className="pagination-buttons"
          >
            Next
          </button>
        </div>
        {isFetching ? <span> Loading...</span> : null}{' '}
      </div>
    </div>
  )
}

export default App
