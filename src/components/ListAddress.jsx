import React, { Component } from 'react';
import FormAddress from 'components/FormAddress';
import { connect } from 'react-redux';
import { fetchAddresses } from 'actions/address';
import { exportTableToCSV } from 'utils/exportTableToCsv';
require('assets/styles/shared/components/_list-address.scss');

const mapStateToProps = (state) => {
  return {
    data: state.address
  };
}

class ListAddress extends Component {
  constructor(props) {
      super(props);
      this.state = {
        currAddress: null
      };
  }

  componentDidMount() {
    this.props.dispatch(fetchAddresses());
  }

  onClickEditItem = (item) => {
    this.setState({currAddress: item});
    window.scrollTo(0, 0);
  }

  handleExportCsv = () => {
    exportTableToCSV(this.refs.tableEle);
  }

  clearCurrAddress = () => {
    this.setState({currAddress: null})
  }

  render() {
    const { data } = this.props

    return(
      <div className="list-address">
        <FormAddress address={this.state.currAddress} dataSize={data.length}
          clearCurrAddress ={this.clearCurrAddress}/>
        <div className="row">
          <div className="col-md-12">
            {!data[0] ? <div className="loading"><i className="fa fa-spinner fa-spin"/></div> : 
            <table className="table table-bordered"
              ref="tableEle">
              <thead>
                <tr>
                  <th>Street</th>
                  <th>Ward</th>
                  <th>District</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {this.props.data.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item.street}</td>
                      <td>{item.ward}</td>
                      <td>{item.district}</td>
                      <td>{item.city}</td>
                      <td>{item.country}</td>
                      <td>
                        <button className="btn btn-primary"type="submit" onClick={this.onClickEditItem.bind(this, item)}>
                          <i className="fa fa-pencil-square-o"/>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>}
          </div>
          <div className="col-sm-6 col-xs-12">
            <div className="form-group">
              <button className="btn btn-primary" onClick={this.handleExportCsv}>
                Export to CSV file
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(ListAddress);


