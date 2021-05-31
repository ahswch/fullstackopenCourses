import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from '../components/Blog'

describe('<Blog />', () => {
    let component
    const addLike = jest.fn()
    const blog = {
        title: 'Component testing',
        author: 'ahswch',
        url: 'https://fullstackopen.com/zh/part5/%E6%B5%8B%E8%AF%95_react_%E5%BA%94%E7%94%A8#exercises-5-13-5-16',
        likes: 1,
        id: 'test',
        user: {
            id: 'test'
        }
    }
    beforeEach(() => {
        component = render(
            <Blog blog={blog} addLike={addLike} />
        )
    })


    test('at start render title and author', () => {
        const div = component.container.querySelector('.blogContent')
        const detailDiv = component.container.querySelector('.detailContent')
        console.log(prettyDOM(div))
        expect(div).toHaveTextContent(
            `${blog.title} ${blog.author}`
        )
        expect(detailDiv).toHaveStyle('display: none')
    })

    test('after clicking the button, the detail displayed', () => {
        const button = component.getByText('view')
        fireEvent.click(button)

        const detailDiv = component.container.querySelector('.detailContent')
        expect(detailDiv).not.toHaveStyle('display: none')
        expect(detailDiv).toHaveTextContent(blog.url)
        expect(detailDiv).toHaveTextContent(`likes: ${blog.likes}`)
    })

    test('click like button twice', () => {
        const buttonShow = component.getByText('view')
        fireEvent.click(buttonShow)


        const button = component.getByText('like')
        fireEvent.click(button)
        fireEvent.click(button)

        expect(addLike.mock.calls).toHaveLength(2)
    })
})