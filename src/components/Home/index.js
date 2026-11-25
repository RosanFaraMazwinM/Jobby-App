import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Home extends Component {
  onClickFindJobs = () => {
    const {history} = this.props
    history.push('/jobs')
  }

  render() {
    return (
      <>
        <Header />
        <div className="bg-container">
          <h1 className="main-heading">Find The Job That Fits Your Life</h1>
          <p className="para">
            Millions of people are searching for jobs,salary information,company
            reviews.Find the job that fits your abilities and potential
          </p>
          <br />
          <Link to="/jobs">
            <button type="button" className="btn">
              Find Jobs
            </button>
          </Link>
        </div>
      </>
    )
  }
}
export default withRouter(Home)
