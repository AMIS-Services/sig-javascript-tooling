import React from 'react'

interface IProps {
  name: string
  city: string
  stars: number
}

const Restaurant = (props: IProps) => {
  return (
    <div>
      <h2>{props.name}</h2>
      <h3>{props.city}</h3>
      <h4>{props.stars}</h4>
    </div>
  )
}

export default Restaurant
