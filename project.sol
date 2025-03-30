// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CrowdsourcedVerification {
    struct Submission {
        string title;
        string description;
        address submitter;
        uint256 upvotes;
        uint256 downvotes;
        bool verified;
    }

    Submission[] public submissions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event SubmissionCreated(uint256 indexed id, string title, string description, address submitter);
    event Voted(uint256 indexed id, address voter, bool voteType);
    event Verified(uint256 indexed id, bool verified);

    function submitData(string memory _title, string memory _description) public {
        submissions.push(Submission({
            title: _title,
            description: _description,
            submitter: msg.sender,
            upvotes: 0,
            downvotes: 0,
            verified: false
        }));
        emit SubmissionCreated(submissions.length - 1, _title, _description, msg.sender);
    }

    function vote(uint256 _id, bool _voteType) public {
        require(_id < submissions.length, "Invalid submission ID");
        require(!hasVoted[_id][msg.sender], "You have already voted");
        
        Submission storage submission = submissions[_id];
        if (_voteType) {
            submission.upvotes++;
        } else {
            submission.downvotes++;
        }
        hasVoted[_id][msg.sender] = true;

        emit Voted(_id, msg.sender, _voteType);
    }

    function verifySubmission(uint256 _id) public {
        require(_id < submissions.length, "Invalid submission ID");
        Submission storage submission = submissions[_id];
        
        if (submission.upvotes > submission.downvotes) {
            submission.verified = true;
            emit Verified(_id, true);
        }
    }

    function getSubmission(uint256 _id) public view returns (string memory, string memory, address, uint256, uint256, bool) {
        require(_id < submissions.length, "Invalid submission ID");
        Submission memory submission = submissions[_id];
        return (submission.title, submission.description, submission.submitter, submission.upvotes, submission.downvotes, submission.verified);
    }
}
