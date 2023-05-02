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
    <div>
      <div>
        <Member_form receivecomandata={receivecomandata} onreload={getreload} />
      </div>
      <div>
        <Member_table discommand={getcommand} receivereload={receivereload} />
      </div>
    </div>
  );
};

export default Members;
