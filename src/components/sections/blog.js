import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import kebabCase from 'lodash/kebabCase';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';

const StyledProjectsSection = styled.section`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-gap: 15px;
    position: relative;
    width: 100%;
    
    @media (min-width: 980px) {
      max-width: 1000px;
    }
    a {
      position: relative;
      z-index: 1;
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

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
    padding: .4rem 1rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    
    header {
      display: inline-grid;
      min-width: 100%;
    }
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    align-items: baseline;

    .project-overline {
      margin-top: 8px;
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

const Blog = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/posts/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              author
              date
              title
              description
              lang
              tags
              slug
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealContainer = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);

  useEffect(() => {
    sr.reveal(revealContainer.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 3;
  const projects = data.projects.edges.filter(({ node }) => node);
  const firstThree = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstThree;

  return (
    <StyledProjectsSection id="blog" ref={revealContainer}>
      <h2 className="numbered-heading">Recent Weblog</h2>

      {/* <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
        view the archive
      </Link> */}

      <ul className="projects-grid">
        <TransitionGroup component={null}>
          {projectsToShow &&
            projectsToShow.map(({ node }, i) => {
              const { frontmatter } = node;
              const { author, date, title, lang, tags, description, slug } = frontmatter;
              const d = new Date(date);

              return (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledProject
                    key={i}
                    ref={el => (revealProjects.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
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
                      </footer>
                    </div>
                  </StyledProject>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      </ul>

      <Link className="more-button inline-link archive-link" to="/blog" ref={revealArchiveLink}>
        view the archive
      </Link>

    </StyledProjectsSection>
  );
};

export default Blog;
