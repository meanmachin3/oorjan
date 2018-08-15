import React from 'react';
import axios from 'axios'
import './App.css';
const API_URL = 'https://www.oorjan.com/blog/wp-json/wp/v2/posts'


class Post extends React.Component {
  render() {
    return  <div className='ui blue fluid card'>
              <div className='content'>
              <div className = "header">
              <a href={this.props.link} target="_blank">{this.props.title}</a>
              </div>
              <div className='meta'>{this.props.published ? `Published: ${(new Date(this.props.published)).toDateString()}` : ''}</div>
              <div className='description'>{this.props.des}</div> 
              </div> 
            </div>           
  }
}


class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handlePostSearch.bind(this);
    this.state = {blogPosts: [], loading: false, query: ''}

  }

  getPosts = (search) => {
    this.setState({loading: true}, () => {
      axios.get(`${API_URL}?per_page=5&search=${search}`)
      .then(({ data }) => {
        data = data.length ? data : [{title: {rendered :"No result found"}, excerpt: {rendered: ''}, published: ''}]
        this.setState({
          blogPosts: data,
          loading: false
        })
      })
    })
  }


  stripHtml = (html) => {
    let temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  handlePostSearch = (event) => {
    console.log(event.type)
    if (event.key === "Enter" || event.type === "click"){
      this.setState({
        query: this.search.value
      }, () => {
        this.getPosts(this.state.query)
      })
    }
      
  }
  render() {
    return (
      <div className='wrapCenter whiteBG'>
        <div className="todoWrap">
         <h1 className="ui center aligned header grey">Welcome to Oorjan</h1>
        <div className = "ui action input">
        <input className='post_search ' type='text' placeholder="Search for topics like 'panel cost'" ref= {input => this.search = input} onKeyPress={this.handlePostSearch}/>
        <button className="ui button" onClick={this.handlePostSearch}>Search</button>
        </div>
        <div className='ui cards padded grid'>
        <h5 className='ui header row'>{this.state.query ? `Showing search results for ${this.state.query}` : ''}</h5>
          {
            this.state.loading? <div class="ui icon message">
            <i class="notched circle loading icon"></i>
            <div class="content">
              <div class="header">
                Just one second
              </div>
              <p>We're fetching that content for you.</p>
            </div>
          </div>:
            this.state.blogPosts.map(function(el) {
              return <Post 
                       key={el.id} 
                       title={el.title.rendered}
                       published={el.date}
                       des={this.stripHtml(el.excerpt.rendered)}
                       link={el.link}
                       />;
            }, this)
          }
        </div>
      </div>
         </div>
    ); 
  }
}
export default PostList;

// ReactDOM.render(
//   <ContactsList />,
//   document.getElementById("root")
// );