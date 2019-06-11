import React from 'react';
import styled from 'styled-components';
import Icon from '../../Icon';
import Gallery from 'react-grid-gallery';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  border: 1px solid #d7d7db;
  margin-left: 10px;
`;
const Details = styled.div`
  word-wrap: break-word;
  font-size: 15px;
  margin: 0 10px;
`;
const Title = styled.div`
  font-size: 21px;
  color: #4a4a4f;
  padding-left: 40px;
`;
const Detail = styled.div`
  padding-bottom: 12px;
`;
const ExpandableDetail = styled(Detail)`
  display: flex;
  align-items: center;
`;
const DetailKey = styled.i`
  color: #0060df;
`;
const DetailValue = styled.span``;
const AssertKey = styled.div`
  color: #0060df;
  font-weight: bold;
`;
const AssertValue = styled.div`
  background-color: #f9f9fa;
  padding: 0 20px;
`;
const Code = styled.pre`
  color: black;
`;
const Description = styled.div`
  font-size: 15px;
  color: #737373;
  white-space: nowrap;
  padding-left: 40px;
`;
const TitleSummary = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: 84px;
  background-color: #f9f9fa;
  overflow: auto;
`;
const DataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background-color: #e6e6e6;
  }
  min-height: 40px;
  padding: 0 30px 0 10px;
  margin: 10px 0;
  font-size: 18px;
  border-bottom: 1px solid transparent;
  ${props => props.expanded && 'border-color: #D7D7DB;'}
`;
const AssertSummary = styled.div`
  display: flex;
  align-items: center;
`;
const AssertMessage = styled.span`
  color: red;
`;
const StyledWarningIcon = styled(Icon)`
  margin-right: 10px;
  flex-shrink: 0;
`;
const ExpandIcon = styled(Icon)`
  ${props => props.expanded && 'transform: rotate(90deg);'}
`;
const ExpandButton = styled.button`
  border: none;
  padding: 0 10px 0 0;
  background: none;
  color: #0060df;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
const ThumbnailButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 10px;
  margin-right: -4px;
  background: none;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  :hover {
    border-radius: 50%;
    background-color: rgba(115, 115, 115, 0.2);
  }
  cursor: pointer;
`;
const ImagesContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0 36px 36px;
  box-sizing: border-box;
  overflow: auto;
`;
const CloseButton = styled.button`
  border: none;
  padding: 10px;
  background: none;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  color: white;
  cursor: pointer;
`;
const GalleryTitle = styled.span`
  font-size: 21px;
`;
const GalleryHeader = styled.div`
  align-items: center;
  background-color: inherit;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const withExpand = WrappedComponent => {
  class WithExpand extends React.Component {
    state = {
      expanded: false
    };

    handleToggleClick = () => {
      this.setState({
        expanded: !this.state.expanded
      });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          expanded={this.state.expanded}
          onToggleClick={this.handleToggleClick}
        />
      );
    }
  }

  return WithExpand;
};

class FailedTestDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assertsSection: false,
      detailsSection: false,
      displayImages: false,
      hasOpenedImage: false
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEsc);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  }
  handleEsc = event => {
    if (event.keyCode === 27 && !this.state.hasOpenedImage) {
      this.setState({ displayImages: false });
    }
  };
  toggleCollapse = expandedSection => {
    this.setState({
      [expandedSection]: !this.state[expandedSection]
    });
  };
  toggleOpenedImage = () => {
    this.setState({
      hasOpenedImage: !this.state.hasOpenedImage
    });
  };

  renderDetails = (data, keyName, KeyComponent, ValueComponent) => {
    const DetailsComponent = withExpand(props => (
      <React.Fragment>
        <ExpandableDetail>
          <ExpandButton type="button" onClick={props.onToggleClick}>
            <ExpandIcon expanded={props.expanded} icon="CarrotRight" />
          </ExpandButton>
          <KeyComponent>{props.attrName}: </KeyComponent>
        </ExpandableDetail>
        {props.expanded && (
          <ValueComponent>
            {this.renderDetails(data[props.attrName], props.attrName, KeyComponent, ValueComponent)}
          </ValueComponent>
        )}
      </React.Fragment>
    ));

    return (
      <Details key={keyName}>
        {Object.keys(data).map(key =>
          data[key] && typeof data[key] === 'object' ? (
            <DetailsComponent key={key} attrName={key} />
          ) : (
            <Detail key={key}>
              <KeyComponent>{key}: </KeyComponent>
              <ValueComponent>{data[key] + ''}</ValueComponent>
            </Detail>
          )
        )}
      </Details>
    );
  };

  render() {
    const { assert, debug_images, ...details } = this.props.test;

    const showCarousel = this.props.test.debug_images && this.props.test.debug_images.length;
    let images = [];
    var path = this.props.test.debug_image_directory;

    if (showCarousel) {
      var new_path = path.replace(/\\/gi, '/') + '/';
      var final_path = new_path.substring(new_path.indexOf('/runs'), new_path.length);

      this.props.test.debug_images.forEach(item => {
        images.push({
          src: final_path + item,
          thumbnail: final_path + item,
          thumbnailWidth: 320,
          thumbnailHeight: 212,
          caption: item
        });
      });
    }

    return (
      <Container>
        {this.state.displayImages && (
          <ImagesContainer>
            <GalleryHeader>
              <GalleryTitle>{this.props.test.name}</GalleryTitle>
              <CloseButton
                onClick={() => this.setState({ displayImages: false })}
                title="Close (Esc)"
              >
                <Icon icon="exit" />
              </CloseButton>
            </GalleryHeader>
            <Gallery
              images={images}
              lightboxWillOpen={this.toggleOpenedImage}
              lightboxWillClose={this.toggleOpenedImage}
              enableImageSelection={false}
            />
          </ImagesContainer>
        )}
        <TitleSummary>
          <Title>{this.props.test.name}</Title>
          <Description>{this.props.test.description}</Description>
        </TitleSummary>

        <DataContainer expanded={this.state.assertsSection}>
          <AssertSummary>
            <StyledWarningIcon icon="Warning" />
            <span>Failed Assert:&nbsp;</span>
            <AssertMessage>{this.props.test.assert.message}</AssertMessage>
          </AssertSummary>
          <ExpandButton type="button" onClick={() => this.toggleCollapse('assertsSection')}>
            <ExpandIcon expanded={this.state.assertsSection} icon="arrowhead-right" />
          </ExpandButton>
        </DataContainer>
        {this.state.assertsSection && (
          <React.Fragment>
            <Details>
              <Detail>
                <AssertKey>code: </AssertKey>
                <AssertValue>
                  <Code>{this.props.test.assert.code}</Code>
                </AssertValue>
              </Detail>
              <Detail>
                <AssertKey>call_stack: </AssertKey>
                <AssertValue>
                  <Code>{this.props.test.assert.call_stack}</Code>
                </AssertValue>
              </Detail>
            </Details>
          </React.Fragment>
        )}

        <DataContainer>
          <span>Debug images</span>
          <ThumbnailButton
            disabled={!showCarousel}
            type="button"
            title="Open image thumbnails"
            onClick={() => this.setState({ displayImages: true })}
          >
            <Icon icon="ThumbnailIcon" />
          </ThumbnailButton>
        </DataContainer>

        <DataContainer expanded={this.state.detailsSection}>
          <span>Details</span>
          <ExpandButton type="button" onClick={() => this.toggleCollapse('detailsSection')}>
            <ExpandIcon expanded={this.state.detailsSection} icon="arrowhead-right" />
          </ExpandButton>
        </DataContainer>
        {this.state.detailsSection &&
          this.renderDetails(details, 'details', DetailKey, DetailValue)}
      </Container>
    );
  }
}

export default FailedTestDetails;
