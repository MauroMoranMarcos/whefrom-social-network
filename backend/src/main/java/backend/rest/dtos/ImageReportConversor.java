package backend.rest.dtos;

import backend.model.entities.ImageReport;

import java.util.List;
import java.util.stream.Collectors;

public class ImageReportConversor {

    private ImageReportConversor() {}

    public final static ImageReportDto toImageReportDto(ImageReport imageReport) {
        return new ImageReportDto(imageReport.getId(), imageReport.getReason().toString(), imageReport.getExplanation(),
                imageReport.getResolved(), imageReport.getDate(), imageReport.getUser().getId(), imageReport.getImageReported().getId());
    }

    public final static List<ImageReportDto> toImageReportDtos(List<ImageReport> imageReports) {

        return imageReports.stream().map(u -> toImageReportDto(u)).collect(Collectors.toList());

    }

}
