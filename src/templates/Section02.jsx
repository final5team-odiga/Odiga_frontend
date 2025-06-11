import React from "react";
import styled from "styled-components";

const StyledSection02 = styled.div`
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

export const Section02 = () => {
  return (
    <StyledSection02>
      <StyledMainImage src="https://placehold.co/473x595" alt="Main view" />
      <StyledTextBlock>
        <StyledHeadline>
          Nothing feels rushed here. The rhythm of the city invites observation
          <br />
        </StyledHeadline>
        <StyledBodyText>
          <br />
          코펜하겐 공항 도착은 오후 8시 시내까지는 지하철로 20분 정도
          <br />
          <br />
          역 안은 조용하고 간결했다.
          <br />
          숙소는 뇌레브로(Nørrebro) 지역의 게스트하우스. 체크인 전까지 가방을
          맡기고 시내를 걷기 시작했다.
          <br />
          <br />
          처음 방문한 곳은 토르할른 시장(Torvehallerne). 브런치와 커피를 먹으며
          도시의 생활 리듬을 관찰했다. 거리의 자전거 이용률, 통일된 간판, 건물
          간의 거리감이 인상 깊었다.
        </StyledBodyText>
      </StyledTextBlock>
      <StyledFrame2>
        <StyledSubImage src="https://placehold.co/182x228" alt="Sub view 1" />
        <StyledSubImage src="https://placehold.co/182x228" alt="Sub view 2" />
      </StyledFrame2>
    </StyledSection02>
  );
};
