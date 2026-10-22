import { movies } from "../assets/data";
import { Row, Col, Card, Button } from "react-bootstrap";

function Movies() {
  return (
    <div>
      <Row className="justify-content-center">
        <h2>Movies</h2>
      </Row>
      <Row className="justify-content-center">
        {movies.map((movie) => (
          <Col md={4} className="mb-4">
            <Card className="p-2 mb-4" key={movie.id}>
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>{movie.description}</Card.Text>
                <Button variant="primary">View show time below</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
export default Movies;
