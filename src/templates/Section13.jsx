import React from "react";
import styled from "styled-components";

const StyledSection13 = styled.div`
  align-self: stretch;
  height: 800px;
  max-width: 1000px;
  padding: 135px 48px 70px 48px;
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 40px;
`;

const StyledMainImage = styled.img`
  width: 473px;
  height: 595px;
`;

const StyledTextBlock = styled.div`
  flex: 1 1 0;
  height: 595px;
`;

const StyledHeadline = styled.span`
  color: black;
  font-size: 16px;
  font-family: Spectral;
  font-weight: 700;
  line-height: 24px;
  word-wrap: break-word;
`;

const StyledBodyText = styled.span`
  color: black;
  font-size: 16px;
  font-family: Spectral;
  font-weight: 400;
  line-height: 24px;
  word-wrap: break-word;
`;

const StyledFrame2 = styled.div`
  width: 182px;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 40px;
`;

const StyledSubImage = styled.img`
  align-self: stretch;
  height: 228px;
`;

export const Section13 = () => {
  return (
    <StyledSection13>
      <StyledMainImage src="https://placehold.co/473x595" alt="Main view" />
      <StyledTextBlock>
        <StyledHeadline>
          The city's design philosophy is evident in every detail
          <br />
        </StyledHeadline>
        <StyledBodyText>
          <br />
          코펜하겐의 디자인 철학은 도시의 모든 곳에서 느낄 수 있다.
          <br />
          <br />
          특히 자전거 도로와 보행자 도로의 구분이 명확하고,
          <br />
          모든 시설물이 사용자의 편의를 최우선으로 고려했다.
          <br />
          <br />
          건물들도 단순하면서도 세련된 디자인으로 통일감이 있다.
          <br />
          이런 디자인 철학이 도시 전체의 분위기를 만들어내고 있다.
        </StyledBodyText>
      </StyledTextBlock>
      <StyledFrame2>
        <StyledSubImage src="https://placehold.co/182x228" alt="Sub view 1" />
        <StyledSubImage src="https://placehold.co/182x228" alt="Sub view 2" />
      </StyledFrame2>
    </StyledSection13>
  );
};
