import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';

const StyledSkillsetsSection = styled.section`
  padding-top: 0;
  max-width: 900px;
  .inner {
    display: flex;
    background: var(--light-navy);
    color: var(--white);
    border-radius: 5px;
    padding: 10px;
    @media (max-width: 600px) {
      display: block;
    }
  }
`;

const StyledTabPanels = styled.div`
  width: 100%;
  margin-left: -3px;
  border-radius: 5px;
  padding: 5px 10px;
  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;
  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }
  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;
    .company {
      color: var(--green);
    }
  }
  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
  .gatsby-highlight {
    margin: 0;
    
    pre[class="language-js"]::before {
      content: 'skillsets';
    }
    code[class*="language-"] {
      font-size: 12px;
    }
  }
`;

const Skillsets = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/skillsets/" } }
        sort: { fields: [frontmatter___number], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              number
              title
              since
            }
            html
          }
        }
      }
    }
  `);

  const jobsData = data.jobs.edges;

  const revealContainer = useRef(null);
  useEffect(() => sr.reveal(revealContainer.current, srConfig()), []);

  return (
    <StyledSkillsetsSection ref={revealContainer}>
      <div className="inner">
        <StyledTabPanels>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { frontmatter, html } = node;

              return (
                <CSSTransition>
                  <StyledTabPanel>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledSkillsetsSection>
  );
};

export default Skillsets;