import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
    skills: data.skills,
    lifeAtCompany: data.life_at_company,
  })

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updatedJobDetails = this.getFormattedData(data.job_details)

      const updatedSimilarJobs = data.similar_jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <Header />

      <div className="failure-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />

        <h1>Oops! Something Went Wrong</h1>

        <p>We cannot seem to find the page you are looking for.</p>

        <button type="button" onClick={this.getJobDetails}>
          Retry
        </button>
      </div>
    </>
  )

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <>
        <Header />

        <div className="job-details-container">
          <div className="job-details-card">
            <div className="job-details-header">
              <img src={companyLogoUrl} alt="job details company logo" />

              <div>
                <h1>{title}</h1>
                <p>⭐ {rating}</p>
              </div>
            </div>

            <div className="job-details-info">
              <div className="job-details-location">
                <p>📍 {location}</p>
                <p>💼 {employmentType}</p>
              </div>

              <p className="job-details-salary">{packagePerAnnum}</p>
            </div>

            <hr />

            <div className="desc-header">
              <h1>Description</h1>
              <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                Visit
              </a>
            </div>

            <p className="job-description">{jobDescription}</p>

            <h1>Skills</h1>

            <ul className="skills-list">
              {skills.map(eachSkill => (
                <li className="skill-item" key={eachSkill.name}>
                  <img src={eachSkill.image_url} alt={eachSkill.name} />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>

            <h1>Life at Company</h1>

            <div className="life-container">
              <p>{lifeAtCompany.description}</p>
              <img src={lifeAtCompany.image_url} alt="life at company" />
            </div>
          </div>

          <h1 className="similar-jobs-heading">Similar Jobs</h1>

          <ul className="similar-jobs-list">
            {similarJobs.map(eachJob => (
              <li className="similar-job-card" key={eachJob.id}>
                <div className="job-details-header">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="similar job company logo"
                  />

                  <div>
                    <h1>{eachJob.title}</h1>
                    <p>⭐ {eachJob.rating}</p>
                  </div>
                </div>

                <div className="job-details-info">
                  <p>📍 {eachJob.location}</p>
                  <p>💼 {eachJob.employmentType}</p>
                </div>

                <hr />

                <h1>Description</h1>
                <p>{eachJob.jobDescription}</p>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return this.renderAllViews()
  }
}

export default JobItemDetails
