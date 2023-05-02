import Lup_member from "./lup_action/lup_member";
import Lup_action from "./lup_action/lup_action";

const Lup_mem_act = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col bg-primary">
          <Lup_member />
        </div>
        <div className="col bg-danger">
          <Lup_action />
        </div>
      </div>
    </div>
  );
};

export default Lup_mem_act;
