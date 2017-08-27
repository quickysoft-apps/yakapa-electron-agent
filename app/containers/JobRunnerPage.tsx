import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { JobRunner, Props } from '../components/JobRunner';
import { Actions } from '../actions';
import { State } from '../reducers'

function mapStateToProps(state: State): Partial<Props> {
  return {     
    jobId: state.jobRunner.jobId,   
    running: state.jobRunner.running,      
    cron: state.jobRunner.cron,
    script: state.jobRunner.script,
    result: state.jobRunner.result,
    error: state.jobRunner.error
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(Actions.JobRunner as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(JobRunner) as any);