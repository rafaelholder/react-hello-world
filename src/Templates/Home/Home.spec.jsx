import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Home } from './index';
import userEvent from '@testing-library/user-event';

const handlers = [
  rest.get('*jsonplaceholder.typicode.com*', async (req, res, ctx) => {
    console.log('A CHAMADA FOI INTERCEPTADA')
    return res(
      ctx.json([
        {
          userId: 1,
          id: 1,
          title: 'title1',
          body: 'body1',
          url: 'img1.jpg',
        },
        {
          userId: 2,
          id: 2,
          title: 'title2',
          body: 'body2',
          url: 'img1.jpg',
        },
        {
          userId: 3,
          id: 3,
          title: 'title3',
          body: 'body3',
          url: 'img3.jpg',
        },
      ]),
    );
  }),
];

const server = setupServer(...handlers);

describe('<Home />', () => {

  beforeAll(()=> {
    server.listen();
  });

  afterEach(()=> {
    server.resetHandlers();
  })

  afterAll(()=> { 
    server.close();
  });

  it('Should render search, posts and load more', async() => {
    render(<Home/>);
    const noMorePosts = screen.getByText('Não existem posts :(');

    expect.assertions(3);

    await waitForElementToBeRemoved(noMorePosts);
    
    const search = screen.getByPlaceholderText(/type your search/i);
    expect(search).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);

    const button = screen.getByRole('button', {name: /load more posts/i});
    expect(button).toBeInTheDocument();
  });

  it('Should  search for posts', async() => {
    render(<Home/>);
    const noMorePosts = screen.getByText('Não existem posts :(');

    // expect.assertions(3);

    await waitForElementToBeRemoved(noMorePosts);
    
    const search = screen.getByPlaceholderText(/type your search/i);
    expect(search).toBeInTheDocument();

    //testing the initial render of the posts 
    expect(screen.getByRole('heading', {name: 'title1'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'title2'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: 'title3'})).not.toBeInTheDocument();
    
    //testing the search bar 
    userEvent.type(search, 'title1');
    expect(screen.getByRole('heading', {name: 'title1'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: 'title2'})).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: 'title3'})).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Search value: title1' })).toBeInTheDocument();
    
    //test the clear of search bar and re-render of the posts 1 and 2
    userEvent.clear(search);
    expect(screen.getByRole('heading', {name: 'title1'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'title2'})).toBeInTheDocument();
    
    //Test search posts that not exist
    userEvent.type(search, 'post does not exist');
    expect(screen.getByText('Não existem posts :(')).toBeInTheDocument();
  });

  it('should load more posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts :(');

    // expect.assertions(3);

    await waitForElementToBeRemoved(noMorePosts);

    const button = screen.getByRole('button', { name: /load more posts/i });

    userEvent.click(button);
    expect(screen.getByRole('heading', { name: 'title3' })).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
})