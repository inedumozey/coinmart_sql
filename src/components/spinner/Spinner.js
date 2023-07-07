import Spinner from 'react-bootstrap/Spinner';

function Spinner_({ size, color = "#0aaabf" }) {

  // animation="border" or "grow"
  return size === 'sm' ?
    <Spinner
      style={{ color }}
      animation="border"
      size="sm"
    /> :

    <Spinner
      style={{ color }}
      animation="border"
    />
}

export default Spinner_;