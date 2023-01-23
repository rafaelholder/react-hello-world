

import { Component } from 'react';
import './App.css';


class App extends Component{
  state = {
    posts: []
  }

  //LIFECYCLE METHODS
  //https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

  // Função que so executa quando o componente é montado, tanto pela primeira vez, 
  //tanto após atualizado
  componentDidMount(){
    this.loadPosts();
  }

  // Função que so executa quando o componente é atualizado, tantas vezes possiveis
  // Recebe parâmetros importantes 
  //componentDidUpdate(){}

  //componentWillUnmount(){}
  // ///////////////////////////////////////////////////////////////////////////// //

  loadPosts = async () =>  {
    
    const photosResponse = fetch('https://jsonplaceholder.typicode.com/photos');
    const postsResponse =  fetch('https://jsonplaceholder.typicode.com/posts');

    const [posts, photos] = await Promise.all([postsResponse, photosResponse]);

    const postsJson = await posts.json();
    const photosJson = await photos.json();

    const postsAndPhotos = postsJson.map((post, index) => {
      return {
        ...post, cover: photosJson[index].url
      }
    })
    this.setState({posts: postsAndPhotos});
      
  }

  /* handleTimeOut = () => {
    const { posts } = this.state;
    posts[0].title = 'titulo mudou'; 

    setTimeout(() => {
      this.setState({
        counter: counter + 1,
        posts,
      })
    }, 1000) 
  } */

  render(){
    const { posts } = this.state;
  

    return (
      <section className='container'> 
        
        <div className="posts-all">
          {posts.map(post => (
            <div className='post'>
              <img src={post.cover} alt={post.title} />
              <div className='post-content' key={post.id}>
                <h1>{post.title}</h1>
                <p onClick={console.log('click <p>')}>{post.body}</p>
              </div>
            </div>
          ))}
        </div>
    </section>
      
      );
    }
}
export default App;
