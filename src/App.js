import React, {useEffect, useState} from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState([])

  async function addNewTransaction(ev) {
    ev.preventDefault()
    const url = `${process.env.REACT_APP_API_URL}/transaction`
    const price = name.split(' ')[0]
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: name.substring(price.length + 1),
        price,
        description,
        datetime,
      }),
    })
    const transaction = await response.json()
    setName('')
    setDatetime('')
    setDescription('')
    console.log(transaction)
  }

  useEffect(() => {
    getTransactions().then(setTransactions)
  }, [])

  async function getTransactions() {
    const url = `${process.env.REACT_APP_API_URL}/transactions`
    const response = await fetch(url)
    return await response.json()
  }
  const [dollars, cents] = transactions
    .reduce((sum, transaction) => (sum += transaction.price), 0)
    .toFixed(2)
    .split('.')
  return (
    <main>
      <h1>
        ${dollars}
        <span>.{cents}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input
            type='text'
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder='+200 new samsung tv'
          />
          <input
            type='datetime-local'
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          />
        </div>
        <div className='description'>
          <input
            type='text'
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder='description'
          />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>
      <div className='transactions'>
        {transactions.length > 0 &&
          transactions.map(({name, price, description, datetime}) => (
            <div className='transaction'>
              <div className='left'>
                <div className='name'>{name}</div>
                <div className='description'>{description}</div>
              </div>
              <div className='right'>
                <div className={`price ${price < 0 ? 'red' : 'green'}`}>
                  {price}
                </div>
                <div className='datetime'>{datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  )
}

export default App
