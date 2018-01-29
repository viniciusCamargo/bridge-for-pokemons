import React, { Component, Fragment } from 'react'
import { get } from 'axios'
import loader from './loader.gif'

export default class App extends Component {
  render() {
    const { pokemons, nextPage, prevPage } = this.state

    return (
      <div className="mw8 pa3 center">
        <input
          id="name"
          className="input-reset ba b--black-20 pa3 mb2 db w-100 mv4"
          type="text"
          placeholder="Search..."
          onChange={this.handleInput}
          onFocus={this.handleFocus}
        />

        <div className="sans-serif f6 f4-ns w-100">
          {pokemons.map((p, i) => <Pokemon key={i} {...p} />)}

          <Arrows
            prev={prevPage}
            next={nextPage}
            onClick={this.handleArrowClick}
          />
        </div>
      </div>
    )
  }

  handleInput = ({ target }) => {
    const inputValue = target.value.toLowerCase()

    return this.setState(({ pokemons }) => {
      const newPokemons = pokemons.reduce((arr, curr) => {
        if (inputValue) {
          if (curr.name.includes(inputValue)) {
            return arr.concat({ ...curr, display: true })
          }

          return arr.concat({ ...curr, display: false })
        }

        return arr.concat({ ...curr, display: true })
      }, [])

      return { pokemons: newPokemons }
    })
  }

  fetch = async (url) => {
    const { data } = await get(url)

    const pokemons = data.results.filter((p) => (p.display = true))

    this.setState({
      pokemons,
      nextPage: data.next || '',
      prevPage: data.previous || ''
    })
  }

  async componentDidMount() {
    await this.fetch('https://pokeapi.co/api/v2/pokemon/?limit=8')
  }

  handleArrowClick = async (url) => {
    await this.fetch(url)
  }

  state = {
    pokemons: [],
    nextPage: '',
    prevPage: ''
  }
}

const type = (types) => <Fragment>{types.join(', ')}</Fragment>

class Pokemon extends Component {
  render() {
    const { name, display } = this.props
    const { id, types, imgSrc } = this.state

    return (
      display && (
        <article className="bg-white w-25-ns w-100 m2 mv2 db dib-ns center">
          <div className="tc br3 pa3 pa4-ns ba b--black-10 b--black-10 ma2">
            <img
              src={imgSrc || loader}
              className="br-100 h4 w4 dib ba b--black-05 pa2"
              alt={name}
            />

            <Fragment>
              <h1 className="f3 mb2 ttc">{name}</h1>
              <h2 className="f5 fw4 gray mt0 ttc">
                #{id} - {type(types)}
              </h2>
            </Fragment>
          </div>
        </article>
      )
    )
  }

  async componentDidMount() {
    await this.fetch(this.props.url)
  }

  async componentWillReceiveProps({ name, url }) {
    if (this.props.name !== name) {
      this.setState(this.initialState())

      await this.fetch(url)
    }
  }

  fetch = async (url) => {
    const { data } = await get(url)

    const id = data.id
    const types = data.types.map((t) => t.type.name)
    const imgSrc = data.sprites.front_default

    this.setState({ id, types, imgSrc })
  }

  initialState = () => ({
    id: '',
    types: [],
    imgSrc: ''
  })

  state = this.initialState()
}

const Arrows = ({ next, prev, onClick }) => {
  const css =
    'pointer f5 no-underline black bg-animate hover-bg-black-70 hover-white inline-flex items-center pa3 ba border-box mh3'

  return (
    <div className="flex items-center justify-center">
      {prev && (
        <p className={css} onClick={() => onClick(prev)}>
          <ArrowIcon
            icon="chevronLeft"
            path="M20 1 L24 5 L14 16 L24 27 L20 31 L6 16 z"
          />
          <span className="pl1">Previous</span>
        </p>
      )}

      {next && (
        <p className={css} onClick={() => onClick(next)}>
          <span className="pr1">Next</span>
          <ArrowIcon
            icon="chevronRight"
            path="M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z"
          />
        </p>
      )}
    </div>
  )
}

const ArrowIcon = ({ icon, path }) => (
  <svg
    className="w1"
    data-icon={icon}
    viewBox="0 0 32 32"
    style={{ fill: 'currentcolor' }}>
    <path d={path} />
  </svg>
)
