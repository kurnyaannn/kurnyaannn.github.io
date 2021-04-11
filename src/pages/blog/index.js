import React from 'react';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import { Icon } from '@components/icons';

const StyledMainContainer = styled.main`
  max-width: 1100px;
  & > header {
    margin-bottom: 100px;
    text-align: center;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);
  list-style: none;
  margin: 15px 0;
  &:hover,
  &:focus-within {
    .project-inner {
      transform: translateY(-7px);
    }
  }
  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 1rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    
    header {
      min-width: 100%;
      max-width: 100%;
    }
  }
  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    align-items: baseline;
    .project-overline {
      margin: 10px 0;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 400;
    }
    .project-links {
      display: flex;
      align-items: center;
      font-size: var(--fz-lg);
      color: var(--light-slate);
      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;
        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    a {
      position: static;
      padding-top: 4px;
      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }
  .project-description {
    color: var(--light-slate);
    font-size: 17px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
  .project-tech-list, .date {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    list-style: none;
    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;
      
      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
    
    .inline-link {
      margin-top: 5px;
      background: var(--lightest-navy);
      padding: 0 5px;
      border-radius: 5px;
    }
    
    svg {
      width: 15px;
      margin-top: -2px;
    }
  }
  .date {
    margin-top: 10px;
  }
  footer {
    ul {
      margin: 0;
    }
  }
`;

const BlogPage = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location}>
      <Helmet title="Weblog" />

      <StyledMainContainer>
        <header>
          <h1 className="big-heading">Weblog</h1>
          <p className="subtitle">
            <a>
              some things that i wrote in my free time
            </a>
          </p>
        </header>

        {posts.length > 0 &&
          posts.map(({ node }, i) => {
            const { frontmatter } = node;
            const { author, title, lang, description, slug, date, tags } = frontmatter;
            const d = new Date(date);

            return (
              <StyledProject>
                <div className="project-inner">
                  <header>
                    <div className="project-top">
                      <p className="project-overline">{author}</p>
                      <div className="project-links">
                        <p>{lang}</p>
                      </div>
                    </div>

                    <h3 className="project-title">
                      <Link to={slug}>
                        <a>{title}</a>
                      </Link>

                    </h3>

                    <div className="project-description">
                      <span>
                        {description}
                      </span>
                    </div>
                  </header>

                  <footer>
                    <ul className="date">
                      <li><Icon name="Time" /> {`${d.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}`}
                      </li>
                    </ul>
                    {tags && (
                      <ul className="project-tech-list">
                        {tags.map((tag, i) => (
                          <li key={i}>
                            <Link
                              to={`/blog/tags/${kebabCase(tag)}/`}
                              className="inline-link">
                              {tag}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </footer>
                </div>
              </StyledProject>
            );
          })}
      </StyledMainContainer>
    </Layout>
  );
};

BlogPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default BlogPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/posts/" }, frontmatter: { draft: { ne: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            author
            title
            description
            lang
            slug
            date
            tags
            draft
          }
          html
        }
      }
    }
  }
`;