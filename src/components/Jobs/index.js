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

const locationsList = [
  {label: 'Hyderabad', locationId: 'Hyderabad'},
  {label: 'Bangalore', locationId: 'Bangalore'},
  {label: 'Chennai', locationId: 'Chennai'},
  {label: 'Delhi', locationId: 'Delhi'},
  {label: 'Mumbai', locationId: 'Mumbai'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobs: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
    locations: [],
    profile: null,
    jobsStatus: apiStatusConstants.initial,
    profileStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch('https://apis.ccbp.in/profile', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        this.setState({
          profile: data.profile_details,
          profileStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          profileStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      this.setState({
        profileStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobs = async () => {
    this.setState({
      jobsStatus: apiStatusConstants.inProgress,
    })

    const {employmentType, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        this.setState({
          jobs: data.jobs,
          jobsStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          jobsStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      this.setState({
        jobsStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearch = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeEmployment = event => {
    const {employmentType} = this.state
    const {value, checked} = event.target

    const updatedEmployment = checked
      ? [...employmentType, value]
      : employmentType.filter(each => each !== value)

    this.setState(
      {
        employmentType: updatedEmployment,
      },
      this.getJobs,
    )
  }

  onChangeSalary = event => {
    this.setState(
      {
        salaryRange: event.target.value,
      },
      this.getJobs,
    )
  }

  onChangeLocation = event => {
    const {locations} = this.state
    const {value, checked} = event.target

    const updatedLocations = checked
      ? [...locations, value]
      : locations.filter(each => each !== value)

    this.setState({
      locations: updatedLocations,
    })
  }

  getFilteredJobs = () => {
    const {jobs, locations} = this.state

    if (locations.length === 0) {
      return jobs
    }

    return jobs.filter(eachJob =>
      locations.some(
        eachLocation =>
          eachJob.location.toLowerCase() === eachLocation.toLowerCase(),
      ),
    )
  }

  renderProfile = () => {
    const {profile, profileStatus} = this.state

    if (profileStatus === apiStatusConstants.failure) {
      return (
        <button type="button" onClick={this.getProfile}>
          Retry
        </button>
      )
    }

    if (profile === null) {
      return null
    }

    return (
      <div className="profile-card">
        <img
          src={profile.profile_image_url}
          alt="profile"
          className="profile-image"
        />
        <h1>{profile.name}</h1>
        <p>{profile.short_bio}</p>
      </div>
    )
  }

  renderFilters = () => {
    const {employmentType, salaryRange, locations} = this.state

    return (
      <div className="filters-container">
        <h3>Type of Employment</h3>

        <ul className="filter-group">
          {employmentTypesList.map(eachType => (
            <li key={eachType.employmentTypeId} className="filter-item">
              <input
                type="checkbox"
                id={eachType.employmentTypeId}
                value={eachType.employmentTypeId}
                checked={employmentType.includes(eachType.employmentTypeId)}
                onChange={this.onChangeEmployment}
              />
              <label htmlFor={eachType.employmentTypeId}>
                {eachType.label}
              </label>
            </li>
          ))}
        </ul>

        <hr />

        <h3>Salary Range</h3>

        <ul className="filter-group">
          {salaryRangesList.map(eachSalary => (
            <li key={eachSalary.salaryRangeId} className="filter-item">
              <input
                type="radio"
                name="salary"
                id={eachSalary.salaryRangeId}
                value={eachSalary.salaryRangeId}
                checked={salaryRange === eachSalary.salaryRangeId}
                onChange={this.onChangeSalary}
              />
              <label htmlFor={eachSalary.salaryRangeId}>
                {eachSalary.label}
              </label>
            </li>
          ))}
        </ul>

        <hr />

        <h3>Location</h3>

        <ul className="filter-group">
          {locationsList.map(eachLocation => (
            <li key={eachLocation.locationId} className="filter-item">
              <input
                type="checkbox"
                id={eachLocation.locationId}
                value={eachLocation.locationId}
                checked={locations.includes(eachLocation.locationId)}
                onChange={this.onChangeLocation}
              />
              <label htmlFor={eachLocation.locationId}>
                {eachLocation.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobItem = eachJob => (
    <li key={eachJob.id} className="job-item">
      <Link to={`/jobs/${eachJob.id}`} className="job-item-link">
        <div className="job-header">
          <img
            src={eachJob.company_logo_url}
            alt="company logo"
            className="company-logo"
          />

          <div>
            <h1>{eachJob.title}</h1>

            <div className="rating-container">
              <FaStar className="star-icon" />
              <p>{eachJob.rating}</p>
            </div>
          </div>
        </div>

        <div className="job-details">
          <div className="job-meta">
            <div>
              <MdLocationOn />
              <p>{eachJob.location}</p>
            </div>

            <div>
              <FaBriefcase />
              <p>{eachJob.employment_type}</p>
            </div>
          </div>

          <p className="salary">{eachJob.package_per_annum}</p>
        </div>

        <hr />

        <h2>Description</h2>
        <p className="job-description">{eachJob.job_description}</p>
      </Link>
    </li>
  )

  renderJobs = () => {
    const filteredJobs = this.getFilteredJobs()

    if (filteredJobs.length === 0) {
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

    return <ul className="jobs-list">{filteredJobs.map(this.renderJobItem)}</ul>
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
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
  )

  render() {
    const {searchInput, jobsStatus} = this.state

    return (
      <>
        <Header />

        <div className="jobs-main">
          <aside className="sidebar">
            {this.renderProfile()}
            <hr />
            {this.renderFilters()}
          </aside>

          <main className="jobs-content">
            <div className="search-bar">
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearch}
                placeholder="Search"
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    this.onClickSearch()
                  }
                }}
              />

              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                <BsSearch />
              </button>
            </div>

            {jobsStatus === apiStatusConstants.inProgress &&
              this.renderLoadingView()}

            {jobsStatus === apiStatusConstants.failure &&
              this.renderFailureView()}

            {jobsStatus === apiStatusConstants.success && this.renderJobs()}
          </main>
        </div>
      </>
    )
  }
}

export default Jobs
