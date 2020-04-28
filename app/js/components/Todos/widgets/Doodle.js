import React from 'react'
import { Button, Col, Grid, Row, Thumbnail} from 'react-bootstrap'

class Doodle extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
      return (
        <div>
            <Grid>
                <Row>
                    <Col>
                    <Thumbnail src={require("images/hero.png")}alt="242x200">
        <h3>Thumbnail label</h3>
        <p>Description</p>
        <p>
          <Button bsStyle="primary">Button</Button>
          
          <Button bsStyle="default">Button</Button>
        </p>
      </Thumbnail>
                    </Col>
                </Row>
            </Grid>
        </div>
        )
    }

}

export default Doodle