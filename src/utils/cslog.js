export default class CSLog {
    constructor(name) {
        this.name = name;
        this.progress = 0;
        this.includeGoal = true;
        this.activities = [];
    }
}