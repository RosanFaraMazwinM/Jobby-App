import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar, FaBriefcase} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

class Jobs extends Component {
  state = {
    jobs: [],
    isLoading: true,
    searchInput: '',
    employmentType: [],
    salaryRange: '',
    profile: null,
    jobsStatus: 'INITIAL',
    profileStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    const data = await response.json()

    if (response.ok) {
      this.setState({
        profile: data.profile_details,
        profileStatus: 'SUCCESS',
      })
    } else {
      this.setState({profileStatus: 'FAILURE'})
    }
  }

  getJobs = async () => {
    const {employmentType, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`

    const response = await fetch(apiUrl, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    const data = await response.json()

    if (response.ok) {
      this.setState({
        jobs: data.jobs,
        isLoading: false,
        jobsStatus: 'SUCCESS',
      })
    } else {
      this.setState({jobsStatus: 'FAILURE', isLoading: false})
    }
  }

  onChangeSearch = e => this.setState({searchInput: e.target.value})

  onClickSearch = () => this.setState({isLoading: true}, this.getJobs)

  onChangeEmployment = e => {
    const {employmentType} = this.state
    const {value, checked} = e.target

    const updatedList = checked
      ? [...employmentType, value]
      : employmentType.filter(each => each !== value)

    this.setState({employmentType: updatedList, isLoading: true}, this.getJobs)
  }

  onChangeSalary = e =>
    this.setState({salaryRange: e.target.value, isLoading: true}, this.getJobs)

  renderJobs = () => {
    const {jobs} = this.state

    if (jobs.length === 0) {
      return (
        <div className="no-jobs">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobs.map(job => (
          <li key={job.id} className="job-card">
            <Link to={`/jobs/${job.id}`} className="job-link">
              <div className="job-header">
                <img src={job.company_logo_url} alt="company logo" />
                <div>
                  <h1>{job.title}</h1>
                  <p>
                    <FaStar color="#fbbf24" /> {job.rating}
                  </p>
                </div>
              </div>

              <div className="job-info">
                <div>
                  <p>
                    <MdLocationOn /> {job.location}
                  </p>
                  <p>
                    <FaBriefcase /> {job.employment_type}
                  </p>
                </div>
                <p className="salary">{job.package_per_annum}</p>
              </div>

              <hr />
              <h3>Description</h3>
              <p>{job.job_description}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {profile, searchInput, isLoading, jobsStatus, profileStatus} =
      this.state

    if (jobsStatus === 'FAILURE') {
      return (
        <>
          <Header />
          <div className="failure-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button type="button" onClick={this.getJobs}>
              Retry
            </button>
          </div>
        </>
      )
    }

    return (
      <>
        <Header />

        <div className="jobs-main">
          {/* LEFT */}
          <div className="sidebar">
            {profileStatus === 'FAILURE' ? (
              <button type="button" onClick={this.getJobDetails}>
                Retry
              </button>
            ) : (
              profile && (
                <div className="profile-card">
                  <img src={profile.profile_image_url} alt="profile" />
                  <h1>{profile.name}</h1>
                  <p>{profile.short_bio}</p>
                </div>
              )
            )}

            <hr />

            <h3>Type of Employment</h3>
            <ul>
              {employmentTypesList.map(item => (
                <li key={item.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={item.employmentTypeId}
                    value={item.employmentTypeId}
                    onChange={this.onChangeEmployment}
                  />
                  <label htmlFor={item.employmentTypeId}>{item.label}</label>
                </li>
              ))}
            </ul>

            <hr />

            <h3>Salary Range</h3>
            <ul>
              {salaryRangesList.map(item => (
                <li key={item.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={item.salaryRangeId}
                    value={item.salaryRangeId}
                    onChange={this.onChangeSalary}
                  />
                  <label htmlFor={item.salaryRangeId}>{item.label}</label>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="jobs-content">
            <div className="search-bar">
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearch}
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                <BsSearch />
              </button>
            </div>

            {isLoading ? (
              <div className="loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
              </div>
            ) : (
              this.renderJobs()
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
