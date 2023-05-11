import Member_table from "./member_table";
import Member_form from "./member_form";

const Members = () => {
  let comanddata = (datainfo) => {};
  const getcommand = (data) => {
    comanddata && comanddata(data);
  };
  const receivecomandata = (handler) => {
    comanddata = handler;
  };

  let comandreload = (datainfo) => {};
  const getreload = (data) => {
    comandreload && comandreload(data);
  };
  const receivereload = (handler) => {
    comandreload = handler;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-9 col-md-12 ">
          <Member_table discommand={getcommand} receivereload={receivereload} />
        </div>
        <div className="col-lg-3 col-md-12 r mt-5">
          <Member_form
            receivecomandata={receivecomandata}
            onreload={getreload}
          />
        </div>
      </div>
    </div>
  );
};

export default Members;
