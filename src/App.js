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
              <div className='meta'>Published: {(new Date(this.props.published)).toDateString()}</div>
              <div className='description'>{this.props.des}</div> 
              </div> 
            </div>           
  }
}


class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handlePostSearch.bind(this);
    this.state = {blogPosts: []}

  }

  getPosts = (search) => {
    axios.get(`${API_URL}?per_page=5&search=${search}`)
      .then(({ data }) => {
        console.log(data)
        this.setState({
          blogPosts: data
        })
      })
  }


  stripHtml = (html) => {
    let temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  handlePostSearch = (event) => {
    if (event.key === "Enter"){
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
        <input className='post_search ' type='text' placeholder="Search..." ref= {input => this.search = input} onKeyPress={this.handlePostSearch}/>
        <div className='ui cards'>
          {
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