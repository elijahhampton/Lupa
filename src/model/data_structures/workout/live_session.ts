function LiveSession(program, participants) {
    this.program = program;
    this.participants = participants;

    this.changeProgram = () => {

    }

    this.refreshProgramData = () => {
        
    }

    this.getLiveSessionDataAsJSON = () => {
        return JSON.stringify({
            session_id: this.sessionID,
            participants: this.participants,
            program: this.program
        })
    }
}

export default LiveSession;