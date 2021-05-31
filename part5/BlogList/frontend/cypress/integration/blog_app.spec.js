describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
        }
        const userTest = {
            name: 'testUser',
            username: 'tusername',
            password: 'root'
        }
        cy.request('POST', 'http://localhost:3001/api/users', user)
        cy.request('POST', 'http://localhost:3001/api/users', userTest)
        cy.visit('http://localhost:3001')
    })

    it('Login form is shown', function() {
        cy.contains('log in').click()
        cy.contains('login in to application')
        cy.get('#login-button').contains('login')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.contains('log in').click()
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()

            cy.contains('Matti Luukkainen logged in')
        })

        it('fails with wrong credentials', function() {
            cy.contains('log in').click()
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.get('.error')
                .should('contain', 'Wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')

            cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'mluukkai', password: 'salainen' })
        })

        it('A blog can be created', function() {
            cy.contains('new blog').click()
            cy.get('#title').type('a blog created by cypress')
            cy.get('#author').type('ahswch')
            cy.get('#url').type('https://www.google.com')
            cy.get('#create-button').click()
            cy.contains('a blog created by cypress ahswch')
        })

        describe('and several blogs exist', function() {
            beforeEach(function() {
                cy.createBlog({ title: 'a blog created by cypress', author: 'ahswch', url: 'https://www.google.com' })
                cy.createBlog({ title: 'title1', author: 'ahswch', url: 'https://www.google.com', likes: 30 })
                cy.createBlog({ title: 'title2', author: 'ahswch', url: 'https://www.google.com', likes: 33 })
                cy.createBlog({ title: 'title3', author: 'ahswch', url: 'https://www.google.com', likes: 2 })
            })
            it('A blog can be liked', function() {
                cy.contains('a blog created by cypress ahswch').parent().as('theBlog')
                cy.get('@theBlog').contains('view').click()
                cy.get('@theBlog').get('.detailContent').contains('likes: 0')
                cy.get('@theBlog').get('.detailContent').contains('likes: 0').parent().find('button').as('theLike')
                cy.get('@theLike').click()
                cy.get('@theBlog').get('.detailContent').contains('likes: 1')
            })

            it('the owner of blog can delete it', function() {
                cy.contains('a blog created by cypress ahswch').parent().as('theBlog')
                cy.get('@theBlog').contains('view').click()
                cy.get('@theBlog').contains('remove').click()

                cy.get('html').should('not.contain', 'a blog created by cypress ahswch')
            })

            it('others can not delete the blog', function() {
                cy.contains('logout').click()
                cy.contains('log in').click()
                cy.get('#username').type('tusername')
                cy.get('#password').type('root')
                cy.get('#login-button').click()

                cy.contains('testUser logged in')

                cy.contains('a blog created by cypress ahswch').parent().as('theBlog')
                cy.get('@theBlog').contains('view').click()
                cy.get('@theBlog').contains('button', 'remove')
                    .and('have.css', 'display', 'none')
                cy.get('@theBlog').contains('button', 'hide')

                cy.get('@theBlog').contains('button', 'remove')
                    .invoke('attr', 'style', 'display: block')
                cy.get('@theBlog').contains('button', 'remove').click()
                cy.get('.error')
                    .should('contain', 'delete must be the blog owner')
                    .and('have.css', 'color', 'rgb(255, 0, 0)')

            })

            it.only('blogs sort by likes', function() {
                cy.server().route('GET', '/api/blogs').as('pageLoad')
                cy.wait('@pageLoad')

                cy.get('.blogContent').then(blog => {
                    cy.wrap(blog[0]).contains('likes: 33')
                    cy.wrap(blog[1]).contains('likes: 30')
                    cy.wrap(blog[2]).contains('likes: 2')
                    cy.wrap(blog[3]).contains('likes: 0')
                })

                cy.contains('a blog created by cypress ahswch').parent().as('blog1')
                cy.contains('title1').parent().as('blog2')
                cy.contains('title2').parent().as('blog3')
                cy.contains('title3').parent().as('blog4')

                cy.get('@blog1').contains('view').click()
                cy.get('@blog2').contains('view').click()
                cy.get('@blog3').contains('view').click()
                cy.get('@blog4').contains('view').click()

                cy.get('@blog1').find('#like-button').as('like1')
                cy.get('@blog2').find('#like-button').as('like2')
                cy.get('@blog3').find('#like-button').as('like3')
                cy.get('@blog4').find('#like-button').as('like4')

                cy.get('@like1').click()
                cy.wait(1000)
                cy.get('@like1').click()
                cy.wait(1000)
                cy.get('@like1').click()
                cy.wait(1000)
                cy.get('@like2').click()
                cy.wait(1000)
                cy.get('@like2').click()
                cy.wait(1000)
                cy.get('@like2').click()
                cy.wait(1000)
                cy.get('@like2').click()
                cy.wait(1000)

                cy.get('.blogContent').then(blog => {
                    cy.wrap(blog[0]).contains('likes: 34')
                    cy.wrap(blog[1]).contains('likes: 33')
                    cy.wrap(blog[2]).contains('likes: 3')
                    cy.wrap(blog[3]).contains('likes: 2')
                })
            })
        })

    })
})