import React, { Component } from 'react'
import moment from 'moment'
import './InfoBox.css'

class InfoBox extends Component {
  constructor(props) {
  	super(props)
  	this.state = {
  		currentPrice: null,
  		monthChangeD: null,
  		monthChangeP: null,
  		updatedAt: null
  	}
  }

  componentDidMount() {
  	const {data} = this.props
	const url = 'https://api.coindesk.com/v1/bpi/currentprice.json'

  	fetch(url)
  		.then(results => results.json())
  		.then(bitcoinData => {
  			const price = bitcoinData.bpi.USD.rate_float
  			const change = price - data[0].y
  			const changeP = (price - data[0].y) / data[0].y * 100

  			this.setState({
  				currentPrice: bitcoinData.bpi.USD.rate_float,
  				monthChangeD: change.toLocaleString('us-EN', { style: 'currency', currency: 'USD'}),
  				monthChangeP: changeP.toFixed(2) + '%',
  				updatedAt: bitcoinData.time.updated
  			})
  		})
  		.catch(e => console.log(e))

  }

  render() {
  	return (
  		<div id='data-container'>
  			{ this.state.currentPrice ?
  				<div id='left' className='box'>
  					<div className='heading'>{this.state.currentPrice.toLocaleString('us-EN', { style: 'currency', currency: 'USD'})}</div>
  					<div className='subtext'>{'Updated ' + moment(this.state.updateAt).fromNow()}</div>
  				</div>
  			  : null
  			}
	        { this.state.currentPrice ?
	          <div id="middle" className='box'>
	            <div className="heading">{this.state.monthChangeD}</div>
	            <div className="subtext">Change Since Last Month (USD)</div>
	          </div>
	          : null
	    	}
	          <div id="right" className='box'>
	            <div className="heading">{this.state.monthChangeP}</div>
	            <div className="subtext">Change Since Last Month (%)</div>
	          </div>

  		</div>
  	)
  }
}

export default InfoBox
