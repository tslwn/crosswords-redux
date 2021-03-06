/** @jsx jsx */
import React from 'react'
import { Styled, jsx, Box, Divider, Grid, Heading } from 'theme-ui'
import { graphql, Link } from 'gatsby'

import { CrosswordType, crosswordTypes } from '../models/crossword'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/Layout'
import Main from '../components/Main'
import SEO from '../components/SEO'

// TODO: tidy up components ...
interface IndexPageProps {
  data: GatsbyTypes.IndexPageQuery
  pageContext: GatsbyTypes.IndexPageQueryVariables
}

interface TypeListItemProps {
  id: string
  date?: number
  number?: number
  slug?: string
}

interface TypeListProps {
  data: GatsbyTypes.IndexPageQuery
  type: CrosswordType
}

const capitalise = (string: string) =>
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`

const TypeListItem: React.FC<TypeListItemProps> = ({
  id,
  date,
  number,
  slug
}) => {
  // defer render to preserve localisation
  const [showItem, setShowItem] = React.useState(false)
  React.useEffect(() => {
    setShowItem(true)
  })

  const numberString = number?.toLocaleString()
  const dateString = date
    ? new Date(date)
        .toLocaleString(undefined, {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })
        .replace(',', '')
    : ''

  return (
    <Box as="li" key={id}>
      <Styled.a
        as={Link}
        // @ts-ignore
        to={`/${slug}`}
      >
        {setShowItem ? `${numberString} / ${dateString}` : ''}
      </Styled.a>
    </Box>
  )
}

const TypeList: React.FC<TypeListProps> = ({ data, type }) => (
  <Box as="section" id={type} sx={{ p: 3 }}>
    <Heading as="h2">{capitalise(type)}</Heading>
    <Divider />
    <Styled.ul>
      {data?.allGuardianCrossword.edges
        .filter(edge => edge.node.crosswordType === type)
        .map(edge => (
          <TypeListItem key={edge.node.id} {...edge.node} />
        ))}
    </Styled.ul>
  </Box>
)

const IndexPage: React.FC<IndexPageProps> = ({ data }) => (
  <Layout>
    <SEO title="Guardian crosswords" />
    <Header title="Guardian crosswords" />
    <Main>
      <Grid columns={[1, 2, null, 4]} gap={0} sx={{ bg: 'muted ' }}>
        {crosswordTypes.map(type => (
          <TypeList key={type} data={data} type={type} />
        ))}
      </Grid>
    </Main>
    <Footer />
  </Layout>
)

export default IndexPage

export const query = graphql`
  query IndexPage {
    allGuardianCrossword(
      sort: { order: [ASC, DESC], fields: [crosswordType, number] }
    ) {
      edges {
        node {
          id
          date
          crosswordType
          name
          number
          slug
        }
      }
    }
  }
`
