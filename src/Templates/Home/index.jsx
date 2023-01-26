import { Component } from 'react';

import './styles.css';


import { loadPosts } from '../../utils/load_posts';
import { Button } from '../../components/Button';
import { Posts } from '../../components/Posts';
import { TextInput } from '../../components/TextInput';



class Home extends Component{
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 9,
    searchValue: '',
  }

  //LIFECYCLE METHODS
  //https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

  // Função que so executa quando o componente é montado, tanto pela primeira vez, 
  //tanto após atualizado
  async componentDidMount(){
    await this.loadPosts();
  }

  // Função que so executa quando o componente é atualizado, tantas vezes possiveis
  // Recebe parâmetros importantes 
  //componentDidUpdate(){}

  //componentWillUnmount(){}
  // ///////////////////////////////////////////////////////////////////////////// //

  loadPosts = async () =>  {
    const {page, postsPerPage} = this.state
    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos
    }); 
  }

  loadMorePosts = () => {
    const {page, postsPerPage, allPosts, posts} = this.state;
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts); 

    this.setState({posts, page: nextPage})
  }

  handleChange = (e) => {
    const {value} = e.target;
    this.setState({searchValue: value});
  }

  render(){
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filteredPosts =  !!searchValue ? 
      allPosts.filter(post => {
        return post.title.toLowerCase().includes(
          searchValue.toLowerCase()
        )
      }) 
      : posts;

    return (
      <section className='container'> 
        
        <div className='search-container'>
          {!!searchValue && (
            <h1> Search Value: {searchValue}</h1>
          )}
          <TextInput 
            searchValue={searchValue} handleChange={this.handleChange} 
          />
        </div>
        
        {filteredPosts.length > 0 && (
          <Posts posts={filteredPosts} />
        )}
        {filteredPosts.length === 0 && (
          <p> Não existem posts :( </p> 
        )}
        
        
        <div className='button-container'>
          {!searchValue && (
            <Button 
              disabled={noMorePosts}
              text='Load More Posts'
              onClick={this.loadMorePosts}
            />
          )}
           
        </div>
        
    </section>
      
      );
    }
}
export default Home;
