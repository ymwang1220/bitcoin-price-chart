import React, { Component } from 'react'
import moment from 'moment'
import './App.css'
import LineChart from './LineChart'
import Tooltip from './ToolTip'
import InfoBox from './InfoBox'


class App extends Component {
  constructor(props) {
  	super(props)
  	this.state = {
  		fetchingData: true,
  		data: null,
  		hoverLoc: null,
  		activePoint: null
  	}
  }

  handleChartHover(hoverLoc, activePoint){
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    })
  }

  componentDidMount() {
	const url = 'https://api.coindesk.com/v1/bpi/historical/close.json'

  	fetch(url)
  		.then(results => results.json())
  		.then(bitcoinData => {
  			const sortedData = []
  			let count = 0
  			for (let date in bitcoinData.bpi) {
  				sortedData.push({
  					d: moment(date).format('MMM DD'),
  					p: bitcoinData.bpi[date].toLocaleString('us-EN', { style: 'currency', currency: 'USD'}),
  					x: count, // previous days
  					y: bitcoinData.bpi[date] // numerical price
  				})
  				count++
  			}
  			this.setState({
  				data: sortedData,
  				fetchingData: false
  			})
  		})
  		.catch(e => console.log(e))

  }


  render() {
    return (
      <div className='container'>
          <div className='container'>
          	<h1>30 Day Bitcoin Price Chart</h1>
          </div>
          <div className='row'>
            { !this.state.fetchingData ?
              <InfoBox data={this.state.data} />
              : null }
          </div>
          <div className='row'>
            <div className='popup'>
              { this.state.hoverLoc ?
                <Tooltip hoverLoc={this.state.hoverLoc}
                         activePoint={this.state.activePoint} />
                : null }
            </div>
          </div>
          <div className='row'>
            <div className='chart'>
              { !this.state.fetchingData ?
                <LineChart data={this.state.data} onChartHover={ (a,b) => this.handleChartHover(a,b) }/>
                : null }
            </div>
          </div>
          <div className='row'>
          	<div id='coindesk'> Powered by <a href='http://www.coindesk.com/price/'>CoinDesk</a></div>
          </div>
      </div>
    )
  }
}

export default App;
