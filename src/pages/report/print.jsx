const Print = (props) => {
  console.log(props.match.params.id);
  return (
    <div>
      <h1>Print</h1>
    </div>
  );
};

export default Print;
