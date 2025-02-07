package backend.rest.dtos;

import backend.model.entities.UserReport;

import java.util.List;
import java.util.stream.Collectors;

public class UserReportConversor {

    private UserReportConversor() {}

    public final static UserReportDto toUserReportDto(UserReport userReport) {
        return new UserReportDto(userReport.getId(), userReport.getReason().toString(), userReport.getExplanation(),
                userReport.getResolved(), userReport.getDate(), userReport.getUser().getId(), userReport.getUserReported().getId());
    }

    public final static List<UserReportDto> toUserReportDtos(List<UserReport> userReports) {

        return userReports.stream().map(u -> toUserReportDto(u)).collect(Collectors.toList());

    }

}
